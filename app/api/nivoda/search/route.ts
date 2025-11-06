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
    const hasMore = totalCount 
      ? (currentOffset + cleanDiamonds.length) < totalCount
      : cleanDiamonds.length === limit // If we got the full limit, assume there might be more
    
    return NextResponse.json({ 
      diamonds: cleanDiamonds,
      total_count: totalCount,
      hasMore
    })
  } catch (error: any) {
    console.error('Error searching diamonds:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search diamonds' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const colorParam = searchParams.get('color')
    const clarityParam = searchParams.get('clarity')
    const cutParam = searchParams.get('cut')
    
    const originParam = searchParams.get('origin')
    const params: DiamondSearchParams = {
      shape: searchParams.get('shape') || undefined,
      minCarat: searchParams.get('minCarat') ? parseFloat(searchParams.get('minCarat')!) : undefined,
      maxCarat: searchParams.get('maxCarat') ? parseFloat(searchParams.get('maxCarat')!) : undefined,
      color: colorParam ? (colorParam.includes(',') ? colorParam.split(',') : [colorParam]) : undefined,
      clarity: clarityParam ? (clarityParam.includes(',') ? clarityParam.split(',') : [clarityParam]) : undefined,
      cut: cutParam ? (cutParam.includes(',') ? cutParam.split(',') : [cutParam]) : undefined,
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
    const hasMore = totalCount 
      ? (currentOffset + cleanDiamonds.length) < totalCount
      : cleanDiamonds.length === limit // If we got the full limit, assume there might be more
    
    return NextResponse.json({ 
      diamonds: cleanDiamonds,
      total_count: totalCount,
      hasMore
    })
  } catch (error: any) {
    console.error('Error searching diamonds:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to search diamonds',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

