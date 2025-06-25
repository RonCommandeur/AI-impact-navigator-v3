import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let finalUrl: string
let finalKey: string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Using fallback configuration.')
  
  // Fallback to the configured values from netlify.toml
  finalUrl = 'https://swtyheoaewjnfatjofdj.supabase.co'
  finalKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3dHloZW9hZXdqbmZhdGpvZmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzEwMTAsImV4cCI6MjA2NTI0NzAxMH0.oIp3Emocv3oUgvRb0uf4P7xJx7NWoPeNFp4ZeKyuBlg'
} else {
  finalUrl = supabaseUrl
  finalKey = supabaseAnonKey
}

// Create the Supabase client with error handling
export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(finalUrl && finalKey && finalUrl !== 'your_supabase_project_url')
}