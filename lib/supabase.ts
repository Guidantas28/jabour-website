import { createClient } from '@supabase/supabase-js'

// Use NEXT_PUBLIC_ for client-side, but also check for server-side variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Supabase configuration - will fail at runtime if variables are missing

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any // Will fail at runtime if used without config
