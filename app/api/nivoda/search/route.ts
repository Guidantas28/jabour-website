import { NextRequest, NextResponse } from 'next/server'
import { searchDiamondsServer, DiamondSearchParams } from '@/lib/nivoda'

export async function POST(request: NextRequest) {
  try {
    const params: DiamondSearchParams = await request.json()
    
    // Validate required parameters
    if (!params.shape) {
      return NextResponse.json(
        { error: 'Shape parameter is required' },
        { status: 400 }
      )
    }
    
    const diamonds = await searchDiamondsServer(params)
    
    // Extract total count from first diamond if available (we added it in nivoda.ts)
    const totalCount = diamonds.length > 0 && (diamonds[0] as any)._totalCount 
      ? (diamonds[0] as any)._totalCount 
      : null
    
    // Remove metadata from diamonds before returning
    const cleanDiamonds = diamonds.map((d: any) => {
      const { _totalCount, ...cleanDiamond } = d
      return cleanDiamond
    })
    
    // Calculate if there are more diamonds
    const currentOffset = params.offset || 0
    const limit = params.limit || 50
    const diamondsReturned = cleanDiamonds.length
    const hasMore = totalCount 
      ? (currentOffset + diamondsReturned) < totalCount
      : diamondsReturned === limit // If we got the full limit, assume there might be more
    
    return NextResponse.json({ 
      diamonds: cleanDiamonds,
      total_count: totalCount,
      hasMore
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to search diamonds' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Use getAll to get all values for parameters that can have multiple values
    const colorParams = searchParams.getAll('color')
    const clarityParams = searchParams.getAll('clarity')
    const cutParams = searchParams.getAll('cut')
    
    const originParam = searchParams.get('origin')
    const params: DiamondSearchParams = {
      shape: searchParams.get('shape') || undefined,
      minCarat: searchParams.get('minCarat') ? parseFloat(searchParams.get('minCarat')!) : undefined,
      maxCarat: searchParams.get('maxCarat') ? parseFloat(searchParams.get('maxCarat')!) : undefined,
      color: colorParams.length > 0 ? colorParams : undefined,
      clarity: clarityParams.length > 0 ? clarityParams : undefined,
      cut: cutParams.length > 0 ? cutParams : undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      origin: originParam === 'natural' || originParam === 'lab-grown' || originParam === 'both' 
        ? originParam as 'natural' | 'lab-grown' | 'both'
        : 'both', // Default to both if not specified
    }
    
    if (!params.shape) {
      return NextResponse.json(
        { error: 'Shape parameter is required' },
        { status: 400 }
      )
    }
    
    const diamonds = await searchDiamondsServer(params)
    
    // Extract total count from first diamond if available (we added it in nivoda.ts)
    const totalCount = diamonds.length > 0 && (diamonds[0] as any)._totalCount 
      ? (diamonds[0] as any)._totalCount 
      : null
    
    // Remove metadata from diamonds before returning
    const cleanDiamonds = diamonds.map((d: any) => {
      const { _totalCount, ...cleanDiamond } = d
      return cleanDiamond
    })
    
    // Calculate if there are more diamonds
    const currentOffset = params.offset || 0
    const limit = params.limit || 50
    const diamondsReturned = cleanDiamonds.length
    const hasMore = totalCount 
      ? (currentOffset + diamondsReturned) < totalCount
      : diamondsReturned === limit // If we got the full limit, assume there might be more
    
    return NextResponse.json({ 
      diamonds: cleanDiamonds,
      total_count: totalCount,
      hasMore
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || 'Failed to search diamonds',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

