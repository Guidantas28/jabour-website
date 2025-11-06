import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Try to sign in with a dummy password to check if email exists
    // This is a workaround since Supabase doesn't have a direct "check if user exists" endpoint
    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password: 'dummy_password_check_12345_xyz',
    })

    // If error is "Invalid login credentials", the email exists but password is wrong
    // If error is "Email not confirmed" or similar, the email exists
    // If error is "User not found" or "Invalid email", the email doesn't exist
    if (signInError) {
      const errorMessage = signInError.message.toLowerCase()
      if (errorMessage.includes('invalid login') || 
          errorMessage.includes('email not confirmed') ||
          errorMessage.includes('email not verified')) {
        return NextResponse.json({ exists: true })
      } else if (errorMessage.includes('user not found') || 
                 errorMessage.includes('invalid email') ||
                 errorMessage.includes('email address')) {
        return NextResponse.json({ exists: false })
      }
    }

    // If no error, the email exists (unlikely with dummy password)
    return NextResponse.json({ exists: false })
  } catch (error: any) {
    console.error('Error checking email:', error)
    // Default to false if there's an error
    return NextResponse.json({ exists: false })
  }
}

