import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Storage bucket names
export const STORAGE_BUCKETS = {
  PRODUCTS: 'products',
  BRANDS: 'brands',
  CATEGORIES: 'categories',
}

// Helper functions for storage
export const getImageUrl = (bucket, path) => {
  if (!path) return null
  
  // If path is already a full URL, return as is
  if (path.startsWith('http')) return path
  
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const uploadImage = async (bucket, path, file) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const deleteImage = async (bucket, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// Auth helpers
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// Database helpers with error handling
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error)
  
  if (error.code === 'PGRST301') {
    return 'Resource not found'
  }
  
  if (error.code === 'PGRST116') {
    return 'No rows returned'
  }
  
  if (error.message.includes('JWT')) {
    return 'Authentication required'
  }
  
  return error.message || 'An error occurred'
}

// Real-time subscription helpers
export const subscribeToProducts = (callback) => {
  return supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products',
      },
      callback
    )
    .subscribe()
}

export const subscribeToOrders = (callback) => {
  return supabase
    .channel('orders-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      callback
    )
    .subscribe()
}

// Utility functions for queries
export const buildProductQuery = (locale = 'ar') => {
  return supabase
    .from('products')
    .select(`
      id,
      sku,
      name_ar,
      name_en,
      slug,
      price,
      sale_price,
      currency,
      stock_qty,
      is_active,
      featured,
      warranty_months,
      energy_rating,
      short_desc_ar,
      short_desc_en,
      created_at,
      brands!inner(
        id,
        name_ar,
        name_en,
        slug
      ),
      categories!inner(
        id,
        name_ar,
        name_en,
        slug
      ),
      media(
        id,
        url,
        alt_ar,
        alt_en,
        is_primary,
        sort_order
      )
    `)
}

export const buildCategoryQuery = (locale = 'ar') => {
  return supabase
    .from('categories')
    .select(`
      id,
      parent_id,
      name_ar,
      name_en,
      slug,
      description_ar,
      description_en,
      icon,
      image_url,
      is_active,
      featured,
      sort_order,
      level
    `)
}

export const buildBrandQuery = (locale = 'ar') => {
  return supabase
    .from('brands')
    .select(`
      id,
      name_ar,
      name_en,
      slug,
      logo_url,
      description_ar,
      description_en,
      is_active,
      sort_order
    `)
}

// Cache helpers
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const getCached = (key) => {
  const item = cache.get(key)
  if (!item) return null
  
  if (Date.now() - item.timestamp > CACHE_DURATION) {
    cache.delete(key)
    return null
  }
  
  return item.data
}

export const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

export const clearCache = (prefix = '') => {
  if (prefix) {
    for (const key of cache.keys()) {
      if (key.startsWith(prefix)) {
        cache.delete(key)
      }
    }
  } else {
    cache.clear()
  }
}

export default supabase