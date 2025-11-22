import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Available diamond shapes
const AVAILABLE_SHAPES = [
  { value: 'round', name: 'Round', description: 'The most popular choice, maximizes brilliance and sparkle' },
  { value: 'oval', name: 'Oval', description: 'Elongates the finger while maintaining brilliance' },
  { value: 'princess', name: 'Princess', description: 'Elegant, modern, and popular square cut' },
  { value: 'emerald', name: 'Emerald', description: 'Rectangular facets showcase clarity beautifully' },
  { value: 'cushion', name: 'Cushion', description: 'Soft pillow shape with unique light separation' },
  { value: 'marquise', name: 'Marquise', description: 'Optimizes carat weight and elongates the finger' },
  { value: 'pear', name: 'Pear', description: 'Feminine and delicate, elongates the finger' },
  { value: 'baguette', name: 'Baguette', description: 'Elegant rectangular cut, perfect for side stones' },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { preferences } = body // Optional preferences from user

    // Get available products to see which shapes are actually available
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        product_configurations(*)
      `)
      .eq('category', 'engagement-rings')
      .eq('active', true)

    if (productsError) {
    }

    // Extract available shapes from products
    const availableShapes = new Set<string>()
    if (products) {
      products.forEach((product: any) => {
        product.product_configurations?.forEach((config: any) => {
          if (config.configuration_type === 'shape' && config.active) {
            let shapeValue = (config.configuration_value?.toLowerCase() || config.display_name?.toLowerCase() || '').trim()
            // Normalize shape names to match our AVAILABLE_SHAPES
            const shapeMap: Record<string, string> = {
              'round': 'round',
              'oval': 'oval',
              'princess': 'princess',
              'emerald': 'emerald',
              'cushion': 'cushion',
              'marquise': 'marquise',
              'pear': 'pear',
              'baguette': 'baguette',
            }
            // Try to find a match
            const normalizedShape = shapeMap[shapeValue] || shapeValue
            if (normalizedShape && AVAILABLE_SHAPES.some(s => s.value === normalizedShape)) {
              availableShapes.add(normalizedShape)
            }
          }
        })
      })
    }

    // If no shapes found in products, use all available shapes
    const shapesToRecommend = availableShapes.size > 0
      ? AVAILABLE_SHAPES.filter(s => availableShapes.has(s.value))
      : AVAILABLE_SHAPES

    if (shapesToRecommend.length === 0) {
      return NextResponse.json(
        { error: 'No diamond shapes available' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      // Fallback: Return a random shape with a generic explanation
      const randomShape = shapesToRecommend[Math.floor(Math.random() * shapesToRecommend.length)]
      return NextResponse.json({
        shape: randomShape.value,
        shapeName: randomShape.name,
        explanation: `We've selected the ${randomShape.name} cut for you. ${randomShape.description}. This is a timeless choice that works beautifully in engagement rings.`,
        aiPowered: false,
      })
    }

    // Build context for GPT
    const shapesList = shapesToRecommend.map(s => `- ${s.name}: ${s.description}`).join('\n')
    const userPreferences = preferences ? `\n\nUser preferences: ${JSON.stringify(preferences)}` : ''

    const prompt = `You are a diamond expert helping a customer choose an engagement ring diamond shape. 

Available diamond shapes:
${shapesList}
${userPreferences}

Based on the available shapes and general engagement ring trends, recommend ONE diamond shape that would be a great choice for an engagement ring. Consider:
- Popularity and timeless appeal
- Brilliance and sparkle
- Versatility with different ring styles
- Overall elegance

Respond in JSON format with:
{
  "shape": "the shape value (lowercase, e.g., 'round', 'oval', etc.)",
  "explanation": "A brief, friendly explanation (2-3 sentences) in British English explaining why this shape was chosen, focusing on its beauty, elegance, and why it's a great choice for an engagement ring. Use British English spelling and phrasing."
}

Only recommend one of the available shapes listed above.`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using the more affordable model
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
        max_tokens: 200,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      // Fallback to random selection
      const randomShape = shapesToRecommend[Math.floor(Math.random() * shapesToRecommend.length)]
      return NextResponse.json({
        shape: randomShape.value,
        shapeName: randomShape.name,
        explanation: `We've selected the ${randomShape.name} cut for you. ${randomShape.description}. This is a timeless choice that works beautifully in engagement rings.`,
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
      // Try to extract JSON from the response (in case it's wrapped in markdown)
      const jsonMatch = aiMessage.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[0])
      } else {
        recommendation = JSON.parse(aiMessage)
      }
    } catch (parseError) {
      // Fallback to random selection
      const randomShape = shapesToRecommend[Math.floor(Math.random() * shapesToRecommend.length)]
      return NextResponse.json({
        shape: randomShape.value,
        shapeName: randomShape.name,
        explanation: `We've selected the ${randomShape.name} cut for you. ${randomShape.description}. This is a timeless choice that works beautifully in engagement rings.`,
        aiPowered: false,
      })
    }

    // Validate that the recommended shape is in our available shapes
    const recommendedShape = shapesToRecommend.find(
      s => s.value.toLowerCase() === recommendation.shape?.toLowerCase()
    )

    if (!recommendedShape) {
      // If AI recommended an invalid shape, use random
      const randomShape = shapesToRecommend[Math.floor(Math.random() * shapesToRecommend.length)]
      return NextResponse.json({
        shape: randomShape.value,
        shapeName: randomShape.name,
        explanation: recommendation.explanation || `We've selected the ${randomShape.name} cut for you. ${randomShape.description}. This is a timeless choice that works beautifully in engagement rings.`,
        aiPowered: true,
      })
    }

    return NextResponse.json({
      shape: recommendedShape.value,
      shapeName: recommendedShape.name,
      explanation: recommendation.explanation || `The ${recommendedShape.name} cut is an excellent choice. ${recommendedShape.description}.`,
      aiPowered: true,
    })
  } catch (error: any) {
    
    // Fallback to random selection
    const randomShape = AVAILABLE_SHAPES[Math.floor(Math.random() * AVAILABLE_SHAPES.length)]
    return NextResponse.json({
      shape: randomShape.value,
      shapeName: randomShape.name,
      explanation: `We've selected the ${randomShape.name} cut for you. ${randomShape.description}. This is a timeless choice that works beautifully in engagement rings.`,
      aiPowered: false,
    })
  }
}

