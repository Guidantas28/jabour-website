import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products/[slug]/images - Get images for a product filtered by shape and/or metal
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const shape = searchParams.get('shape')
    const metal = searchParams.get('metal')

    // First, get the product ID
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Build query for images
    let query = supabase
      .from('product_images')
      .select('*')
      .eq('product_id', product.id)
      .order('display_order', { ascending: true })

    // Filter by shape and metal
    // Priority: exact match > shape match > metal match > default (null)
    if (shape && metal) {
      // Try exact match first
      query = query.or(`and(shape.eq.${shape},metal.eq.${metal}),and(shape.eq.${shape},metal.is.null),and(shape.is.null,metal.eq.${metal}),and(shape.is.null,metal.is.null)`)
    } else if (shape) {
      query = query.or(`shape.eq.${shape},shape.is.null`)
    } else if (metal) {
      query = query.or(`metal.eq.${metal},metal.is.null`)
    }

    const { data: images, error: imagesError } = await query

    if (imagesError) {
      return NextResponse.json(
        { error: 'Failed to fetch images', details: imagesError.message },
        { status: 500 }
      )
    }

    // Sort images by priority:
    // 1. Exact match (shape + metal)
    // 2. Shape match only
    // 3. Metal match only
    // 4. Default (null for both)
    const sortedImages = (images || []).sort((a: any, b: any) => {
      const aExact = shape && metal && a.shape === shape && a.metal === metal ? 0 : 1
      const bExact = shape && metal && b.shape === shape && b.metal === metal ? 0 : 1
      if (aExact !== bExact) return aExact - bExact

      const aShapeMatch = shape && a.shape === shape ? 0 : 1
      const bShapeMatch = shape && b.shape === shape ? 0 : 1
      if (aShapeMatch !== bShapeMatch) return aShapeMatch - bShapeMatch

      const aMetalMatch = metal && a.metal === metal ? 0 : 1
      const bMetalMatch = metal && b.metal === metal ? 0 : 1
      if (aMetalMatch !== bMetalMatch) return aMetalMatch - bMetalMatch

      return (a.display_order || 0) - (b.display_order || 0)
    })

    return NextResponse.json({ images: sortedImages })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}



