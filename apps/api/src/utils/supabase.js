import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with service role key for admin operations
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper function to verify auth token
export const verifyAuthToken = async (token) => {
  try {
    const { data, error } = await supabase.auth.getUser(token)
    if (error) throw error
    return data.user
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

// Helper function to get user role
export const getUserRole = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data.role
  } catch (error) {
    return 'customer' // default role
  }
}

export default supabase