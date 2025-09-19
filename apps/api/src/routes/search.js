import { Router } from 'express'
import { supabase } from '../utils/supabase.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { searchLimiter } from '../middleware/rateLimiter.js'
import { validate, searchSchema } from '../utils/validation.js'

const router = Router()

// Search products
router.get('/products', 
  searchLimiter,
  validate(searchSchema),
  asyncHandler(async (req, res) => {
    const { q, locale, limit } = req.validatedQuery

    // Use the search function we created in the seed file
    const { data, error } = await supabase
      .rpc('search_products', {
        search_term: q,
        locale: locale
      })
      .limit(limit)

    if (error) {
      throw error
    }

    res.json(data)
  })
)

// Autocomplete search
router.get('/autocomplete', 
  searchLimiter,
  validate(searchSchema),
  asyncHandler(async (req, res) => {
    const { q, locale, limit } = req.validatedQuery

    // Simple autocomplete using ILIKE
    const searchField = locale === 'ar' ? 'name_ar' : 'name_en'
    
    const { data, error } = await supabase
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
        brands!inner(name_ar, name_en),
        media!left(url, is_primary)
      `)
      .eq('is_active', true)
      .ilike(searchField, `%${q}%`)
      .order(searchField)
      .limit(limit)

    if (error) {
      throw error
    }

    // Format response for autocomplete
    const formattedData = data.map(product => ({
      id: product.id,
      slug: product.slug,
      name_ar: product.name_ar,
      name_en: product.name_en,
      price: product.price,
      currency: product.currency,
      brand_name: locale === 'ar' ? product.brands?.name_ar : product.brands?.name_en,
      image: product.media?.find(m => m.is_primary)?.url || product.media?.[0]?.url
    }))

    res.json(formattedData)
  })
)

export default router