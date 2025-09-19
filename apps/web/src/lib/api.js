import axios from 'axios'
import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// Categories API
export const categoriesAPI = {
  getAll: async (locale = 'ar') => {
    const { data } = await api.get('/categories', {
      params: { locale }
    })
    return data
  },

  getById: async (id, locale = 'ar') => {
    const { data } = await api.get(`/categories/${id}`, {
      params: { locale }
    })
    return data
  },

  getBySlug: async (slug, locale = 'ar') => {
    const { data } = await api.get(`/categories/slug/${slug}`, {
      params: { locale }
    })
    return data
  },

  getProducts: async (categoryId, params = {}) => {
    const { data } = await api.get(`/categories/${categoryId}/products`, {
      params
    })
    return data
  },
}

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/products', { params })
    return data
  },

  getById: async (id, locale = 'ar') => {
    const { data } = await api.get(`/products/${id}`, {
      params: { locale }
    })
    return data
  },

  getBySlug: async (slug, locale = 'ar') => {
    const { data } = await api.get(`/products/slug/${slug}`, {
      params: { locale }
    })
    return data
  },

  getFeatured: async (locale = 'ar', limit = 8) => {
    const { data } = await api.get('/products/featured', {
      params: { locale, limit }
    })
    return data
  },

  getBestSellers: async (locale = 'ar', limit = 8) => {
    const { data } = await api.get('/products/best-sellers', {
      params: { locale, limit }
    })
    return data
  },

  getNewArrivals: async (locale = 'ar', limit = 8) => {
    const { data } = await api.get('/products/new-arrivals', {
      params: { locale, limit }
    })
    return data
  },

  getRelated: async (productId, locale = 'ar', limit = 4) => {
    const { data } = await api.get(`/products/${productId}/related`, {
      params: { locale, limit }
    })
    return data
  },
}

// Search API
export const searchAPI = {
  products: async (query, locale = 'ar', limit = 10) => {
    const { data } = await api.get('/search/products', {
      params: { q: query, locale, limit }
    })
    return data
  },

  autocomplete: async (query, locale = 'ar', limit = 5) => {
    const { data } = await api.get('/search/autocomplete', {
      params: { q: query, locale, limit }
    })
    return data
  },
}

// Compare API
export const compareAPI = {
  compare: async (productIds, locale = 'ar') => {
    const { data } = await api.post('/compare', {
      productIds,
      locale
    })
    return data
  },
}

// Brands API
export const brandsAPI = {
  getAll: async (locale = 'ar') => {
    const { data } = await api.get('/brands', {
      params: { locale }
    })
    return data
  },

  getById: async (id, locale = 'ar') => {
    const { data } = await api.get(`/brands/${id}`, {
      params: { locale }
    })
    return data
  },

  getProducts: async (brandId, params = {}) => {
    const { data } = await api.get(`/brands/${brandId}/products`, {
      params
    })
    return data
  },
}

// Services API
export const servicesAPI = {
  getAll: async (locale = 'ar') => {
    const { data } = await api.get('/services', {
      params: { locale }
    })
    return data
  },

  getById: async (id, locale = 'ar') => {
    const { data } = await api.get(`/services/${id}`, {
      params: { locale }
    })
    return data
  },
}

// Quotes API
export const quotesAPI = {
  create: async (quoteData) => {
    const { data } = await api.post('/quotes', quoteData)
    return data
  },

  getAll: async (params = {}) => {
    const { data } = await api.get('/quotes', { params })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/quotes/${id}`)
    return data
  },

  update: async (id, updates) => {
    const { data } = await api.put(`/quotes/${id}`, updates)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/quotes/${id}`)
    return data
  },
}

// Orders API (if cart is enabled)
export const ordersAPI = {
  create: async (orderData) => {
    const { data } = await api.post('/orders', orderData)
    return data
  },

  getAll: async (params = {}) => {
    const { data } = await api.get('/orders', { params })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/orders/${id}`)
    return data
  },

  update: async (id, updates) => {
    const { data } = await api.put(`/orders/${id}`, updates)
    return data
  },

  getUserOrders: async (userId, params = {}) => {
    const { data } = await api.get(`/orders/user/${userId}`, { params })
    return data
  },
}

// Admin API
export const adminAPI = {
  // Products
  createProduct: async (productData) => {
    const { data } = await api.post('/admin/products', productData)
    return data
  },

  updateProduct: async (id, updates) => {
    const { data } = await api.put(`/admin/products/${id}`, updates)
    return data
  },

  deleteProduct: async (id) => {
    const { data } = await api.delete(`/admin/products/${id}`)
    return data
  },

  // Categories
  createCategory: async (categoryData) => {
    const { data } = await api.post('/admin/categories', categoryData)
    return data
  },

  updateCategory: async (id, updates) => {
    const { data } = await api.put(`/admin/categories/${id}`, updates)
    return data
  },

  deleteCategory: async (id) => {
    const { data } = await api.delete(`/admin/categories/${id}`)
    return data
  },

  // Brands
  createBrand: async (brandData) => {
    const { data } = await api.post('/admin/brands', brandData)
    return data
  },

  updateBrand: async (id, updates) => {
    const { data } = await api.put(`/admin/brands/${id}`, updates)
    return data
  },

  deleteBrand: async (id) => {
    const { data } = await api.delete(`/admin/brands/${id}`)
    return data
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const { data } = await api.get('/admin/dashboard/stats')
    return data
  },

  // Upload media
  uploadMedia: async (formData) => {
    const { data } = await api.post('/admin/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },
}

// Error handling utility
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    
    if (status === 400) {
      return data.message || 'Invalid request data'
    }
    
    if (status === 401) {
      return 'Authentication required'
    }
    
    if (status === 403) {
      return 'Access denied'
    }
    
    if (status === 404) {
      return 'Resource not found'
    }
    
    if (status >= 500) {
      return 'Server error. Please try again later.'
    }
    
    return data.message || 'Request failed'
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.'
  } else {
    // Other error
    return error.message || 'An unexpected error occurred'
  }
}

// Utility function to build query string
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()
  
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item))
      } else {
        searchParams.append(key, value)
      }
    }
  })
  
  return searchParams.toString()
}

export default api