// Nivoda GraphQL API Client
// Documentation: https://bitbucket.org/nivoda/nivoda-api/src/main/

// Use server-side env var first, fallback to NEXT_PUBLIC for client-side (though this shouldn't be used client-side)
const NIVODA_ENDPOINT = (process.env.NIVODA_ENDPOINT || process.env.NEXT_PUBLIC_NIVODA_ENDPOINT || 'https://integrations.nivoda.net/api/diamonds').trim()
const NIVODA_USERNAME = process.env.NIVODA_USERNAME || ''
const NIVODA_PASSWORD = process.env.NIVODA_PASSWORD || ''

// Token cache (valid for 6 hours)
let authToken: string | null = null
let tokenExpiry: number = 0

// GraphQL query for authentication
// Based on Nivoda API documentation
const AUTHENTICATE_QUERY = `
  query Authenticate($username: String!, $password: String!) {
    authenticate {
      username_and_password(username: $username, password: $password) {
        token
      }
    }
  }
`

export interface Diamond {
  id: string
  diamond?: {
    id: string
    image?: string
    video?: string
    certificate?: {
      id: string
      lab?: string
      shape?: string
      certNumber: string
      carats: number
      color?: string
      clarity?: string
      cut?: string
    }
  }
  price?: number
  discount?: number
}

export interface DiamondSearchParams {
  shape?: string
  minCarat?: number
  maxCarat?: number
  color?: string[]
  clarity?: string[]
  cut?: string[]
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
  origin?: 'natural' | 'lab-grown' // Filter by diamond origin (undefined = both)
}

// GraphQL query to search diamonds
// Based on Nivoda API documentation - uses as(token) wrapper
const SEARCH_DIAMONDS_QUERY = `
  query SearchDiamonds($token: String!, $query: DiamondQuery, $limit: Int, $offset: Int, $order: DiamondOrder) {
    as(token: $token) {
      diamonds_by_query(
        query: $query,
        limit: $limit,
        offset: $offset,
        order: $order
      ) {
        items {
          id
          diamond {
            id
            image
            video
            certificate {
              id
              lab
              shape
              certNumber
              carats
              color
              clarity
              cut
            }
          }
          price
          discount
        }
        total_count
      }
    }
  }
`

// Map shape names to Nivoda API format
const shapeMapping: Record<string, string> = {
  'round': 'ROUND',
  'oval': 'OVAL',
  'princess': 'PRINCESS',
  'emerald': 'EMERALD',
  'square-emerald': 'SQUARE_EMERALD',
  'asscher': 'ASSCHER',
  'cushion': 'CUSHION',
  'marquise': 'MARQUISE',
  'pear': 'PEAR',
  'square-radiant': 'SQUARE_RADIANT',
  'radiant': 'RADIANT',
  'heart': 'HEART',
  'old-miner': 'OLD_MINER',
  'star': 'STAR',
  'rose': 'ROSE',
  'square': 'SQUARE',
}

export async function searchDiamonds(params: DiamondSearchParams): Promise<Diamond[]> {
  try {
    // Validate credentials
    if (!NIVODA_USERNAME || !NIVODA_PASSWORD) {
      throw new Error('Nivoda credentials not configured. Please set NIVODA_USERNAME and NIVODA_PASSWORD environment variables.')
    }
    
    // Validate shape parameter
    if (!params.shape) {
      throw new Error('Shape parameter is required')
    }
    
    // Prepare authentication header (only works on server-side)
    if (typeof window !== 'undefined') {
      throw new Error('Nivoda API client can only be used server-side')
    }

    // Authenticate and get Bearer token
    const bearerToken = await authenticate()
    
    // Build filters for GraphQL query
    const filters: any = {}
    
    if (params.shape) {
      const nivodaShape = shapeMapping[params.shape.toLowerCase()] || params.shape.toUpperCase()
      filters.shape = nivodaShape
    }
    
    if (params.minCarat || params.maxCarat) {
      filters.carat = {}
      if (params.minCarat) filters.carat.min = params.minCarat
      if (params.maxCarat) filters.carat.max = params.maxCarat
    }
    
    if (params.color && params.color.length > 0) {
      filters.color = params.color.map((c: string) => c.toUpperCase())
    }
    
    if (params.clarity && params.clarity.length > 0) {
      filters.clarity = params.clarity.map((c: string) => c.toUpperCase())
    }
    
    if (params.cut && params.cut.length > 0) {
      filters.cut = params.cut.map((c: string) => c.toUpperCase())
    }
    
    if (params.minPrice || params.maxPrice) {
      filters.price = {}
      if (params.minPrice) filters.price.min = params.minPrice
      if (params.maxPrice) filters.price.max = params.maxPrice
    }
    
    const pagination: any = {
      limit: params.limit || 50,
      offset: params.offset || 0,
    }
    
    // Build DiamondQuery according to Nivoda API documentation
    // Format matches the example: shapes array, sizes array with {from, to}, has_v360, has_image, labgrown, color array
    const query: any = {
      has_image: true, // Always filter for diamonds with images
      has_v360: true, // Filter for diamonds with 360 video
    }
    
    // Add labgrown filter only if origin is specified
    if (params.origin === 'lab-grown') {
      query.labgrown = true
    } else if (params.origin === 'natural') {
      query.labgrown = false
    }
    // If origin is undefined, don't include labgrown filter (shows both types)
    
    // Map filters to Nivoda API format
    // Shape is always required and validated earlier
    if (filters.shape) {
      // shapes should be an array according to Nivoda API
      query.shapes = [filters.shape]
    }
    
    // Only include sizes if carat filters are provided
    if (filters.carat && (filters.carat.min !== undefined || filters.carat.max !== undefined)) {
      // sizes should be an array with {from, to} objects according to Nivoda API
      query.sizes = [{
        from: filters.carat.min || 0,
        to: filters.carat.max || 30.0
      }]
    }
    
    // Color, clarity, and cut filters
    if (filters.color && filters.color.length > 0) {
      // Nivoda API expects color as an array of enum values (e.g., [D, E])
      query.color = filters.color.map((c: string) => c.toUpperCase().trim())
    }
    
    if (filters.clarity && filters.clarity.length > 0) {
      // Nivoda API expects clarity as an array
      query.clarity = filters.clarity.map((c: string) => c.toUpperCase().trim())
    }
    
    if (filters.cut && filters.cut.length > 0) {
      // Nivoda API expects cut as an array, with underscores instead of spaces
      query.cut = filters.cut.map((c: string) => {
        const upper = c.toUpperCase().trim()
        return upper.replace(/\s+/g, '_')
      })
    }
    
    if (filters.price) {
      query.dollar_value = {
        from: filters.price.min || 0,
        to: filters.price.max || 5000000
      }
    }
    
    // Order by price ascending (lowest to highest)
    const order = {
      type: 'price',
      direction: 'ASC'
    }
    
    const requestBody = {
      query: SEARCH_DIAMONDS_QUERY,
      variables: {
        token: bearerToken,
        query: query,
        limit: pagination.limit,
        offset: pagination.offset,
        order: order,
      },
    }
    
    const response = await fetch(NIVODA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(requestBody),
    })
    
    const responseText = await response.text()
    
    if (!response.ok) {
      throw new Error(`Nivoda API error (${response.status}): ${response.statusText}. ${responseText}`)
    }
    
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
    }
    
    // Extract diamonds from response structure: as(token) { diamonds_by_query { items { ... }, total_count } }
    const items = data.data?.as?.diamonds_by_query?.items
    const totalCount = data.data?.as?.diamonds_by_query?.total_count
    
    // Return items with metadata
    let diamonds = Array.isArray(items) ? items : []
    
    // Sort by price ascending (lowest to highest) to ensure cheapest diamonds come first
    // This is a safety measure in case the API doesn't respect the order parameter
    diamonds = diamonds.sort((a: any, b: any) => {
      const priceA = a.price || 0
      const priceB = b.price || 0
      return priceA - priceB
    })
    
    // Convert prices from cents to pounds if they appear to be in cents
    // Nivoda API returns prices in cents (smallest currency unit)
    if (diamonds.length > 0) {
      const prices = diamonds.map((d: any) => d.price || 0).filter((p: number) => p > 0)
      if (prices.length > 0) {
        const minPrice = Math.min(...prices)
        // Check if prices are in cents (smallest currency unit)
        // Nivoda API typically returns prices in cents/pence
        // If minimum price is > 100, it's almost certainly in cents (diamonds don't cost < £1)
        const likelyInCents = minPrice > 100 || prices.some(p => p > 1000)
        
        if (likelyInCents) {
          diamonds.forEach((d: any) => {
            if (d.price && d.price > 0) {
              d.price = d.price / 100
            }
            if (d.discount && d.discount > 0) {
              d.discount = d.discount / 100
            }
          })
        }
      }
    }
    
    // Add metadata to each diamond for pagination
    return diamonds.map((diamond: any) => ({
      ...diamond,
      _totalCount: totalCount,
    }))
  } catch (error: any) {
    throw error
  }
}

// Authenticate and get token
async function authenticate(): Promise<string> {
  try {
    // Check if we have a valid token
    if (authToken && Date.now() < tokenExpiry) {
      return authToken
    }

    // Prepare authentication header
    if (typeof window !== 'undefined') {
      throw new Error('Nivoda API client can only be used server-side')
    }

    if (!NIVODA_USERNAME || !NIVODA_PASSWORD) {
      throw new Error('Nivoda credentials not configured. Please set NIVODA_USERNAME and NIVODA_PASSWORD environment variables.')
    }

    const auth = Buffer.from(`${NIVODA_USERNAME}:${NIVODA_PASSWORD}`).toString('base64')

    const response = await fetch(NIVODA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        query: AUTHENTICATE_QUERY,
        variables: {
          username: NIVODA_USERNAME,
          password: NIVODA_PASSWORD,
        },
      }),
    })

    const responseText = await response.text()

    if (!response.ok) {
      throw new Error(`Authentication failed (${response.status}): ${responseText}`)
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    if (data.errors) {
      throw new Error(`Authentication errors: ${JSON.stringify(data.errors)}`)
    }

    // Extract token from authenticate response structure
    const token = data.data?.authenticate?.username_and_password?.token

    if (!token) {
      throw new Error('No token received from authentication. Response structure: ' + JSON.stringify(data, null, 2))
    }

    // Cache token for 5.5 hours (slightly less than 6 hours to be safe)
    authToken = token
    tokenExpiry = Date.now() + 5.5 * 60 * 60 * 1000

    return token
  } catch (error: any) {
    // Reset token on error
    authToken = null
    tokenExpiry = 0
    throw error
  }
}

// Server-side function to search diamonds (for API routes)
export async function searchDiamondsServer(params: DiamondSearchParams): Promise<Diamond[]> {
  // This will be called from API routes where we have access to server-side env vars
  return searchDiamonds(params)
}

