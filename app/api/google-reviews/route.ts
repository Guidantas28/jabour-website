import { NextResponse } from 'next/server'

// Google Places API (New) - Para buscar reviews
// Você precisará obter o Place ID do seu negócio no Google My Business
// e configurar a API key do Google Cloud Platform

export async function GET() {
  try {
    const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID // Place ID do seu negócio
    const apiKey = process.env.GOOGLE_API_KEY // API Key do Google Cloud Platform

    if (!placeId || !apiKey) {
      // Se não tiver configurado, retorna reviews mock para desenvolvimento
      return NextResponse.json({
        reviews: [
          {
            author_name: 'Sarah Johnson',
            rating: 5,
            text: 'Absolutely stunning craftsmanship! My engagement ring exceeded all expectations.',
            time: Date.now() / 1000 - 86400, // 1 day ago
          },
          {
            author_name: 'Michael Chen',
            rating: 5,
            text: 'The team at Jabour Jewellery is incredibly professional and patient. Highly recommend!',
            time: Date.now() / 1000 - 172800, // 2 days ago
          },
          {
            author_name: 'Emma Williams',
            rating: 5,
            text: 'Beautiful pieces and excellent service. Couldn\'t be happier with my purchase.',
            time: Date.now() / 1000 - 259200, // 3 days ago
          },
        ],
        rating: 5.0,
        total_reviews: 3,
      })
    }

    // Buscar reviews usando Google Places API (New)
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=reviews,rating,userRatingCount&key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch reviews')
    }

    const data = await response.json()

    return NextResponse.json({
      reviews: data.reviews || [],
      rating: data.rating || 0,
      total_reviews: data.userRatingCount || 0,
    })
  } catch (error) {
    
    // Retorna reviews mock em caso de erro
    return NextResponse.json({
      reviews: [
        {
          author_name: 'Sarah Johnson',
          rating: 5,
          text: 'Absolutely stunning craftsmanship! My engagement ring exceeded all expectations.',
          time: Date.now() / 1000 - 86400,
        },
        {
          author_name: 'Michael Chen',
          rating: 5,
          text: 'The team at Jabour Jewellery is incredibly professional and patient. Highly recommend!',
          time: Date.now() / 1000 - 172800,
        },
        {
          author_name: 'Emma Williams',
          rating: 5,
          text: 'Beautiful pieces and excellent service. Couldn\'t be happier with my purchase.',
          time: Date.now() / 1000 - 259200,
        },
      ],
      rating: 5.0,
      total_reviews: 3,
    })
  }
}

