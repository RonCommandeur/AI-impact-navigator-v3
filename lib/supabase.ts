import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

// Create a demo/mock client when environment variables are not properly configured
let supabaseClient: any = null

try {
  // Only create real Supabase client if we have proper environment variables
  if (supabaseUrl !== 'https://demo.supabase.co' && supabaseAnonKey !== 'demo-key') {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  } else {
    // Create a mock Supabase client for demo mode
    supabaseClient = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode - authentication disabled' } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode - authentication disabled' } }),
        signInWithOAuth: () => Promise.resolve({ error: { message: 'Demo mode - authentication disabled' } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        admin: {
          listUsers: () => Promise.resolve({ data: { users: [] }, error: null })
        }
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'Demo mode' } }),
            order: () => Promise.resolve({ data: [], error: null }),
            limit: () => ({
              maybeSingle: () => Promise.resolve({ data: null, error: null })
            })
          }),
          order: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'Demo mode' } })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - data not saved' } })
          })
        }),
        update: () => ({
          eq: () => Promise.resolve({ error: { message: 'Demo mode - data not saved' } }),
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - data not saved' } })
          })
        }),
        upsert: () => Promise.resolve({ error: { message: 'Demo mode - data not saved' } }),
        delete: () => ({
          eq: () => Promise.resolve({ error: null })
        })
      }),
      rpc: () => Promise.resolve({ error: { message: 'Demo mode - RPC not available' } })
    }
  }
} catch (error) {
  console.warn('Supabase initialization failed, running in demo mode:', error)
  // Fallback to mock client if real client creation fails
  supabaseClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode - authentication disabled' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode - authentication disabled' } }),
      signInWithOAuth: () => Promise.resolve({ error: { message: 'Demo mode - authentication disabled' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'Demo mode' } })
        })
      })
    })
  }
}

export const supabase = supabaseClient

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    // Check if we're in demo mode
    if (supabaseUrl === 'https://demo.supabase.co' || supabaseAnonKey === 'demo-key') {
      console.log('Running in demo mode - Supabase connection skipped')
      return false
    }

    // Simple health check using a basic query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "relation does not exist" which is fine for testing connection
      console.error('Supabase connection error:', error)
      return false
    }

    console.log('Supabase connection successful')
    return true
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
}

// Auth helpers
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}