import { createClient } from '@supabase/supabase-js'

// Using placeholder values if environment variables are missing to prevent crashes during build or dev
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (typeof window !== 'undefined') {
    console.warn('Supabase URL or Anon Key is missing. The app is running in "Mock Mode". Please add your keys to .env')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
