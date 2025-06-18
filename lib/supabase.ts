import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Using fallback configuration.')
  
  // Fallback to the configured values from netlify.toml
  const fallbackUrl = 'https://swtyheoaewjnfatjofdj.supabase.co'
  const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3dHloZW9hZXdqbmZhdGpvZmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzEwMTAsImV4cCI6MjA2NTI0NzAxMH0.oIp3Emocv3oUgvRb0uf4P7xJx7NWoPeNFp4ZeKyuBlg'
  
  export const supabase = createClient(fallbackUrl, fallbackKey)
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
}