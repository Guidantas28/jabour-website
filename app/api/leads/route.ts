import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source, campaign } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!supabase) {
      // If Supabase is not configured, just return success (for development)
      // In production, you might want to log to a different service
      return NextResponse.json({ 
        success: true, 
        message: 'Lead captured (database not configured)' 
      })
    }

    // Try to insert into leads table (if it exists)
    // If the table doesn't exist, this will fail gracefully
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          email: email.toLowerCase().trim(),
          source: source || 'christmas_popup',
          campaign: campaign || 'christmas_2024',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      // If table doesn't exist, that's okay - we'll just log it
      // In production, you might want to create the table or use a different service
      console.error('Error saving lead:', error)
      
      // Still return success so the user sees the confirmation
      return NextResponse.json({ 
        success: true, 
        message: 'Lead captured' 
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Lead saved successfully',
      data 
    })
  } catch (error: any) {
    console.error('Error in leads API:', error)
    
    // Return success anyway so user sees confirmation
    return NextResponse.json({ 
      success: true, 
      message: 'Lead captured' 
    }, { status: 200 })
  }
}




