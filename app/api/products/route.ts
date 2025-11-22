import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products - List all active products
export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured', details: 'Supabase client is not initialized. Check environment variables.' },
        { status: 500 }
      )
    }


    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const includeInactive = searchParams.get('includeInactive') === 'true'

    // CRITICAL: Select distinct products by slug to avoid duplicates
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        category,
        description,
        base_price,
        featured_image_url,
        active,
        diamond_selection_mode,
        created_at,
        updated_at,
        product_configurations(*),
        product_images(*),
        product_diamond_settings(*),
        product_diamond_customization_options(*)
      `)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (!includeInactive) {
      query = query.eq('active', true)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message, code: error.code },
        { status: 500 }
      )
    }

    // CRITICAL: Remove duplicates by slug - Use slug as unique identifier, NEVER ID
    // If multiple products have the same slug, keep only the one with the most recent created_at
    let uniqueProducts: any[] = []
    if (data && data.length > 0) {
      const slugMap = new Map<string, any>()
      
      data.forEach((p: any) => {
        // Skip products without slug - they are invalid
        if (!p.slug || p.slug.trim() === '') {
          return
        }
        
        const existing = slugMap.get(p.slug)
        if (!existing) {
          // First occurrence of this slug
          slugMap.set(p.slug, p)
        } else {
          // Duplicate slug found - prioritize product with base_price
          const existingHasPrice = existing.base_price && existing.base_price > 0
          const currentHasPrice = p.base_price && p.base_price > 0
          
          if (currentHasPrice && !existingHasPrice) {
            // Current has price, existing doesn't - keep current
            slugMap.set(p.slug, p)
          } else if (!currentHasPrice && existingHasPrice) {
            // Existing has price, current doesn't - keep existing
          } else {
            // Both have or don't have price - keep the one with more recent created_at
            const existingDate = new Date(existing.created_at || 0).getTime()
            const currentDate = new Date(p.created_at || 0).getTime()
            if (currentDate > existingDate) {
              slugMap.set(p.slug, p)
            }
          }
        }
      })
      
      uniqueProducts = Array.from(slugMap.values())
      
      // Final validation: ensure all products have valid slugs
      uniqueProducts = uniqueProducts.filter((p: any) => {
        if (!p.slug || p.slug.trim() === '') {
          return false
        }
        return true
      })
    }

    return NextResponse.json({ products: uniqueProducts })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      category,
      description,
      base_price,
      featured_image_url,
      active,
      diamond_selection_mode,
      configurations,
      images,
      diamond_settings,
    } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([
        {
          name,
          slug,
          category: category || 'engagement-rings',
          description,
          base_price: base_price || 0,
          featured_image_url,
          active: active !== undefined ? active : true,
          diamond_selection_mode: diamond_selection_mode || 'nivoda',
        },
      ])
      .select()
      .single()

    if (productError) {
      return NextResponse.json(
        { error: 'Failed to create product', details: productError.message },
        { status: 500 }
      )
    }

    // Create configurations if provided
    if (configurations && Array.isArray(configurations) && configurations.length > 0) {
      const configsToInsert = configurations.map((config: any) => ({
        product_id: product.id,
        configuration_type: config.type,
        configuration_value: config.value,
        display_name: config.display_name || config.value,
        price_adjustment: config.price_adjustment || 0,
        display_order: config.display_order || 0,
        active: config.active !== undefined ? config.active : true,
        metadata: config.metadata || null,
      }))

      const { error: configError } = await supabase
        .from('product_configurations')
        .insert(configsToInsert)

      if (configError) {
        // Continue even if configurations fail
      }
    }

    // Create images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      const imagesToInsert = images.map((img: any, index: number) => ({
        product_id: product.id,
        image_url: img.url,
        shape: img.shape || null,
        metal: img.metal || null,
        display_order: img.display_order !== undefined ? img.display_order : index,
        is_primary: img.is_primary || false,
      }))

      const { error: imageError } = await supabase
        .from('product_images')
        .insert(imagesToInsert)

      if (imageError) {
        // Continue even if images fail
      }
    }

    // Create diamond settings if provided
    if (diamond_settings && Array.isArray(diamond_settings) && diamond_settings.length > 0) {
      const settingsToInsert = diamond_settings.map((setting: any) => ({
        product_id: product.id,
        shape: setting.shape || null,
        min_carat: setting.min_carat || 0.30,
        max_carat: setting.max_carat || 10.00,
        allowed_colors: setting.allowed_colors || null,
        allowed_clarities: setting.allowed_clarities || null,
        allowed_cuts: setting.allowed_cuts || null,
        origin: setting.origin || 'both',
        min_price: setting.min_price || 0,
        max_price: setting.max_price || 100000,
      }))

      const { error: settingsError } = await supabase
        .from('product_diamond_settings')
        .insert(settingsToInsert)

      if (settingsError) {
        // Continue even if settings fail
      }
    }

    // Fetch the complete product with all relations
    const { data: completeProduct, error: fetchError } = await supabase
      .from('products')
      .select(`
        *,
        product_configurations(*),
        product_images(*),
        product_diamond_settings(*),
        product_diamond_customization_options(*)
      `)
      .eq('id', product.id)
      .single()

    if (fetchError) {
    }

    return NextResponse.json({
      product: completeProduct || product,
      message: 'Product created successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

