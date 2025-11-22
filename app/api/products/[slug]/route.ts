import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products/[slug] - Get a single product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured', details: 'Supabase client is not initialized. Check environment variables.' },
        { status: 500 }
      )
    }

    const { slug } = params

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_configurations(*),
        product_images(*),
        product_diamond_settings(*),
        product_diamond_customization_options(*)
      `)
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { error: 'Product not found', slug },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch product', details: error.message, code: error.code },
        { status: 500 }
      )
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', slug },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/products/[slug] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()

    // First, get the product ID
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single()

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const productId = existingProduct.id

    // Update product
    const productUpdate: any = {}
    if (body.name !== undefined) productUpdate.name = body.name
    if (body.slug !== undefined) productUpdate.slug = body.slug
    if (body.category !== undefined) productUpdate.category = body.category
    if (body.description !== undefined) productUpdate.description = body.description
    if (body.base_price !== undefined) productUpdate.base_price = body.base_price
    if (body.featured_image_url !== undefined) productUpdate.featured_image_url = body.featured_image_url
    if (body.active !== undefined) productUpdate.active = body.active
    if (body.diamond_selection_mode !== undefined) productUpdate.diamond_selection_mode = body.diamond_selection_mode

    if (Object.keys(productUpdate).length > 0) {
      const { error: updateError } = await supabase
        .from('products')
        .update(productUpdate)
        .eq('id', productId)

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update product', details: updateError.message },
          { status: 500 }
        )
      }
    }

    // Update configurations if provided
    if (body.configurations !== undefined) {
      // Delete existing configurations
      await supabase
        .from('product_configurations')
        .delete()
        .eq('product_id', productId)

      // Insert new configurations
      if (Array.isArray(body.configurations) && body.configurations.length > 0) {
        const configsToInsert = body.configurations.map((config: any) => ({
          product_id: productId,
          configuration_type: config.type,
          configuration_value: config.value,
          display_name: config.display_name || config.value,
          price_adjustment: config.price_adjustment || 0,
          display_order: config.display_order || 0,
          active: config.active !== undefined ? config.active : true,
          metadata: config.metadata || null,
        }))

        await supabase
          .from('product_configurations')
          .insert(configsToInsert)
      }
    }

    // Update images if provided
    if (body.images !== undefined) {
      // Delete existing images
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId)

      // Insert new images
      if (Array.isArray(body.images) && body.images.length > 0) {
        const imagesToInsert = body.images.map((img: any, index: number) => ({
          product_id: productId,
          image_url: img.url,
          shape: img.shape || null,
          metal: img.metal || null,
          display_order: img.display_order !== undefined ? img.display_order : index,
          is_primary: img.is_primary || false,
        }))

        await supabase
          .from('product_images')
          .insert(imagesToInsert)
      }
    }

    // Update diamond settings if provided
    if (body.diamond_settings !== undefined) {
      // Delete existing settings
      await supabase
        .from('product_diamond_settings')
        .delete()
        .eq('product_id', productId)

      // Insert new settings
      if (Array.isArray(body.diamond_settings) && body.diamond_settings.length > 0) {
        const settingsToInsert = body.diamond_settings.map((setting: any) => ({
          product_id: productId,
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

        await supabase
          .from('product_diamond_settings')
          .insert(settingsToInsert)
      }
    }

    // Fetch the complete updated product
    const { data: updatedProduct, error: fetchUpdatedError } = await supabase
      .from('products')
      .select(`
        *,
        product_configurations(*),
        product_images(*),
        product_diamond_settings(*),
        product_diamond_customization_options(*)
      `)
      .eq('id', productId)
      .single()

    if (fetchUpdatedError) {
    }

    return NextResponse.json({
      product: updatedProduct,
      message: 'Product updated successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[slug] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('slug', slug)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete product', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

