// Nivoda GraphQL API Client
// Documentation: https://bitbucket.org/nivoda/nivoda-api/src/main/

const NIVODA_ENDPOINT = process.env.NEXT_PUBLIC_NIVODA_ENDPOINT || 'https://integrations.nivoda.net/api/diamonds'
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
  origin?: 'natural' | 'lab-grown' | 'both' // Filter by diamond origin
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
      filters.color = Array.isArray(params.color) 
        ? params.color.map(c => c.toUpperCase())
        : [params.color.toUpperCase()]
    }
    
    if (params.clarity && params.clarity.length > 0) {
      filters.clarity = Array.isArray(params.clarity)
        ? params.clarity.map(c => c.toUpperCase())
        : [params.clarity.toUpperCase()]
    }
    
    if (params.cut && params.cut.length > 0) {
      filters.cut = Array.isArray(params.cut)
        ? params.cut.map(c => c.toUpperCase())
        : [params.cut.toUpperCase()]
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
    const query: any = {
      has_image: true, // Always filter for diamonds with images
      returns: true, // Always filter for returnable diamonds
    }
    
    // Handle diamondType filter (natural vs lab-grown)
    if (params.origin) {
      if (params.origin === 'natural') {
        query.diamondType = 'NATURAL'
      } else if (params.origin === 'lab-grown') {
        query.diamondType = 'LAB_GROWN'
      }
      // If 'both', don't add diamondType filter (show all)
    }
    
    if (Object.keys(filters).length > 0) {
      // Map filters to Nivoda API format
      if (filters.shape) query.shapes = filters.shape // shapes is a string, not array
      if (filters.carat) {
        query.sizes = {
          from: filters.carat.min || 0,
          to: filters.carat.max || 30.0
        }
      }
      if (filters.color) query.color = filters.color // array of colors
      if (filters.clarity) query.clarity = filters.clarity // array of clarities
      if (filters.cut) query.cut = filters.cut // array of cuts
      if (filters.price) {
        query.dollar_value = {
          from: filters.price.min || 0,
          to: filters.price.max || 5000000
        }
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
    
    console.log('Nivoda API Request:', {
      endpoint: NIVODA_ENDPOINT,
      filters,
      pagination,
    })
    
    console.log('Sending diamonds query with Bearer token...')
    const response = await fetch(NIVODA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(requestBody),
    })
    
    const responseText = await response.text()
    console.log('Diamonds query response status:', response.status)
    console.log('Diamonds query response body:', responseText.substring(0, 500)) // First 500 chars
    
    if (!response.ok) {
      console.error('Nivoda API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      })
      throw new Error(`Nivoda API error (${response.status}): ${response.statusText}. ${responseText}`)
    }
    
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }
    
    console.log('Nivoda API Response structure:', {
      hasData: !!data.data,
      hasErrors: !!data.errors,
      dataKeys: data.data ? Object.keys(data.data) : [],
      diamondCount: data.data?.as?.diamonds_by_query?.items?.length || 0,
    })
    
    if (data.errors) {
      console.error('GraphQL Errors in response:', JSON.stringify(data.errors, null, 2))
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
    }
    
    // Extract diamonds from response structure: as(token) { diamonds_by_query { items { ... }, total_count } }
    const items = data.data?.as?.diamonds_by_query?.items
    const totalCount = data.data?.as?.diamonds_by_query?.total_count
    
    // Return items with metadata
    const diamonds = Array.isArray(items) ? items : []
    
    // Add metadata to each diamond for pagination
    return diamonds.map((diamond: any) => ({
      ...diamond,
      _totalCount: totalCount,
    }))
  } catch (error: any) {
    console.error('Error searching diamonds:', error)
    throw error
  }
}

// Authenticate and get token
async function authenticate(): Promise<string> {
  try {
    // Check if we have a valid token
    if (authToken && Date.now() < tokenExpiry) {
      console.log('Using cached Nivoda token')
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

    console.log('Attempting Nivoda authentication...', {
      endpoint: NIVODA_ENDPOINT,
      hasUsername: !!NIVODA_USERNAME,
      hasPassword: !!NIVODA_PASSWORD,
    })

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
    console.log('Authentication response status:', response.status)
    console.log('Authentication response body:', responseText)

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
      console.error('Authentication GraphQL errors:', JSON.stringify(data.errors, null, 2))
      throw new Error(`Authentication errors: ${JSON.stringify(data.errors)}`)
    }

    console.log('Authentication data structure:', JSON.stringify(data, null, 2))

    // Extract token from authenticate response structure
    const token = data.data?.authenticate?.username_and_password?.token

    if (!token) {
      console.error('Full authentication response:', JSON.stringify(data, null, 2))
      throw new Error('No token received from authentication. Response structure: ' + JSON.stringify(data, null, 2))
    }

    // Cache token for 5.5 hours (slightly less than 6 hours to be safe)
    authToken = token
    tokenExpiry = Date.now() + 5.5 * 60 * 60 * 1000

    console.log('Nivoda authentication successful, token cached')
    return token
  } catch (error: any) {
    console.error('Error authenticating with Nivoda:', error)
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

