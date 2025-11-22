import { NextRequest, NextResponse } from 'next/server'

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const videoUrl = searchParams.get('url')

  if (!videoUrl) {
    return NextResponse.json(
      { error: 'Video URL is required' },
      { status: 400 }
    )
  }

  // Validate that the URL is from loupe360.com for security
  if (!videoUrl.includes('loupe360.com')) {
    return NextResponse.json(
      { error: 'Invalid video source' },
      { status: 400 }
    )
  }

  try {
    // Get range header if present (for video seeking)
    const rangeHeader = request.headers.get('range')
    
    // Build headers for the fetch request
    const fetchHeaders: HeadersInit = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }
    
    // Only add Range header if it exists
    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader
    }

    // Fetch the video from loupe360.com with streaming support
    const response = await fetch(videoUrl, {
      headers: fetchHeaders,
    })

    if (!response.ok && response.status !== 206) {
      return NextResponse.json(
        { error: `Failed to fetch video: ${response.statusText}` },
        { status: response.status }
      )
    }

    // Get the video data as a stream for better memory efficiency
    const videoStream = response.body

    if (!videoStream) {
      return NextResponse.json(
        { error: 'No video data received' },
        { status: 500 }
      )
    }

    // Determine content type from response or default to video/mp4
    const contentType = response.headers.get('content-type') || 'video/mp4'
    const contentLength = response.headers.get('content-length')
    const contentRange = response.headers.get('content-range')
    const acceptRanges = response.headers.get('accept-ranges') || 'bytes'

    // Build response headers
    const headers: HeadersInit = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
      'Accept-Ranges': acceptRanges,
    }

    if (contentLength) {
      headers['Content-Length'] = contentLength
    }

    if (contentRange) {
      headers['Content-Range'] = contentRange
    }

    // Return partial content status for range requests
    const status = response.status === 206 ? 206 : 200

    // Return the video stream with proper headers
    return new NextResponse(videoStream, {
      status,
      headers,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

