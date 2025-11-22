import { NextRequest, NextResponse } from 'next/server'

interface Diamond {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { diamonds, preferences } = body

    if (!diamonds || !Array.isArray(diamonds) || diamonds.length === 0) {
      return NextResponse.json(
        { error: 'No diamonds provided' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      // Fallback: Return a random diamond (preferring cheaper ones)
      const sortedByPrice = [...diamonds].sort((a, b) => {
        const priceA = a.price || 0
        const priceB = b.price || 0
        return priceA - priceB
      })
      const recommendedDiamond = sortedByPrice[0] || diamonds[0]
      
      return NextResponse.json({
        diamondId: recommendedDiamond.id,
        explanation: `We've selected a diamond for you based on value. This ${recommendedDiamond.diamond?.certificate?.carats?.toFixed(2) || 'diamond'} carat diamond offers excellent quality at a competitive price.`,
        aiPowered: false,
      })
    }

    // Prepare diamond data for GPT
    const diamondsSummary = diamonds.slice(0, 50).map((d: Diamond) => {
      const cert = d.diamond?.certificate
      return {
        id: d.id,
        carat: cert?.carats || 0,
        color: cert?.color || 'Unknown',
        clarity: cert?.clarity || 'Unknown',
        cut: cert?.cut || 'Unknown',
        price: d.price || 0,
        lab: cert?.lab || 'Unknown',
      }
    })

    const userPreferences = preferences ? `\n\nUser preferences: ${JSON.stringify(preferences)}` : ''

    const prompt = `You are a diamond expert helping a customer choose a diamond for their engagement ring from a selection of available diamonds.

Available diamonds (showing up to 50):
${diamondsSummary.map((d: any, i: number) => 
  `${i + 1}. ID: ${d.id}, ${d.carat}ct, Colour: ${d.color}, Clarity: ${d.clarity}, Cut: ${d.cut}, Price: £${(d.price || 0).toFixed(2)}, Lab: ${d.lab}`
).join('\n')}
${userPreferences}

Based on the available diamonds, recommend ONE specific diamond that offers the best value and quality for an engagement ring. Consider:
- Best balance of the 4Cs (Carat, Colour, Clarity, Cut)
- Price-to-quality ratio
- Overall value proposition
- Suitability for an engagement ring

Respond in JSON format with:
{
  "diamondId": "the exact ID of the recommended diamond",
  "explanation": "A brief, friendly explanation (2-3 sentences) in British English explaining why this specific diamond was chosen, mentioning its key attributes (carat, colour, clarity, cut) and why it represents excellent value for an engagement ring. Use British English spelling and phrasing."
}

Only recommend one of the diamonds listed above. Use the exact ID from the list.`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful diamond expert assistant based in the UK. Always respond in valid JSON format only. Use British English spelling and phrasing in all responses.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      // Fallback to cheapest diamond
      const sortedByPrice = [...diamonds].sort((a, b) => {
        const priceA = a.price || 0
        const priceB = b.price || 0
        return priceA - priceB
      })
      const recommendedDiamond = sortedByPrice[0] || diamonds[0]
      
      return NextResponse.json({
        diamondId: recommendedDiamond.id,
        explanation: `We've selected a diamond for you based on value. This ${recommendedDiamond.diamond?.certificate?.carats?.toFixed(2) || 'diamond'} carat diamond offers excellent quality at a competitive price.`,
        aiPowered: false,
      })
    }

    const openaiData = await openaiResponse.json()
    const aiMessage = openaiData.choices?.[0]?.message?.content

    if (!aiMessage) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON from AI response
    let recommendation
    try {
      const jsonMatch = aiMessage.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[0])
      } else {
        recommendation = JSON.parse(aiMessage)
      }
    } catch (parseError) {
      // Fallback to cheapest diamond
      const sortedByPrice = [...diamonds].sort((a, b) => {
        const priceA = a.price || 0
        const priceB = b.price || 0
        return priceA - priceB
      })
      const recommendedDiamond = sortedByPrice[0] || diamonds[0]
      
      return NextResponse.json({
        diamondId: recommendedDiamond.id,
        explanation: `We've selected a diamond for you based on value. This ${recommendedDiamond.diamond?.certificate?.carats?.toFixed(2) || 'diamond'} carat diamond offers excellent quality at a competitive price.`,
        aiPowered: false,
      })
    }

    // Validate that the recommended diamond ID exists
    const recommendedDiamond = diamonds.find(d => d.id === recommendation.diamondId)

    if (!recommendedDiamond) {
      // If AI recommended an invalid diamond, use cheapest
      const sortedByPrice = [...diamonds].sort((a, b) => {
        const priceA = a.price || 0
        const priceB = b.price || 0
        return priceA - priceB
      })
      const fallbackDiamond = sortedByPrice[0] || diamonds[0]
      
      return NextResponse.json({
        diamondId: fallbackDiamond.id,
        explanation: recommendation.explanation || `We've selected a diamond for you based on value. This ${fallbackDiamond.diamond?.certificate?.carats?.toFixed(2) || 'diamond'} carat diamond offers excellent quality at a competitive price.`,
        aiPowered: true,
      })
    }

    return NextResponse.json({
      diamondId: recommendation.diamondId,
      explanation: recommendation.explanation || `We've selected this ${recommendedDiamond.diamond?.certificate?.carats?.toFixed(2) || 'diamond'} carat diamond for you. It offers excellent quality and represents great value for your engagement ring.`,
      aiPowered: true,
    })
  } catch (error: any) {
    
    // Fallback to cheapest diamond
    const body = await request.json().catch(() => ({}))
    const diamonds = (body as any)?.diamonds || []
    
    if (diamonds.length > 0) {
      const sortedByPrice = [...diamonds].sort((a: any, b: any) => {
        const priceA = a.price || 0
        const priceB = b.price || 0
        return priceA - priceB
      })
      const recommendedDiamond = sortedByPrice[0] || diamonds[0]
      
      return NextResponse.json({
        diamondId: recommendedDiamond.id,
        explanation: `We've selected a diamond for you based on value. This ${recommendedDiamond.diamond?.certificate?.carats?.toFixed(2) || 'diamond'} carat diamond offers excellent quality at a competitive price.`,
        aiPowered: false,
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to recommend diamond' },
      { status: 500 }
    )
  }
}

