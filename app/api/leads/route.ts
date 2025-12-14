import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const WEBHOOK_URL = 'https://n8n.wearemaster.com/webhook/f1cd5d2c-099e-42d3-874c-39bc6e81dedb'

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

    const normalizedEmail = email.toLowerCase().trim()
    const leadSource = source || 'christmas_popup'
    const leadCampaign = campaign || 'christmas_2025'

    let leadId: string | null = null
    let webhookSent = false

    // Save to Supabase first
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert([
            {
              email: normalizedEmail,
              source: leadSource,
              campaign: leadCampaign,
              webhook_sent: false,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single()

        if (error) {
          // If it's a duplicate, try to get the existing lead
          if (error.code === '23505') { // Unique violation
            const { data: existingLead } = await supabase
              .from('leads')
              .select('id, webhook_sent')
              .eq('email', normalizedEmail)
              .eq('source', leadSource)
              .eq('campaign', leadCampaign)
              .single()

            if (existingLead) {
              leadId = existingLead.id
              webhookSent = existingLead.webhook_sent
            }
          } else {
            console.error('Error saving lead to Supabase:', error)
          }
        } else if (data) {
          leadId = data.id
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
      }
    }

    // Send to webhook (don't fail if this fails)
    if (!webhookSent) {
      try {
        const webhookResponse = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: normalizedEmail,
            source: leadSource,
            campaign: leadCampaign,
            timestamp: new Date().toISOString(),
          }),
        })

        if (webhookResponse.ok) {
          webhookSent = true

          // Update Supabase record to mark webhook as sent
          if (supabase && leadId) {
            await supabase
              .from('leads')
              .update({
                webhook_sent: true,
                webhook_sent_at: new Date().toISOString(),
              })
              .eq('id', leadId)
          }
        } else {
          console.error('Webhook returned error:', webhookResponse.status, webhookResponse.statusText)
        }
      } catch (webhookError) {
        console.error('Error sending to webhook:', webhookError)
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Lead saved successfully',
      data: {
        email: normalizedEmail,
        source: leadSource,
        campaign: leadCampaign,
        webhook_sent: webhookSent,
      }
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







