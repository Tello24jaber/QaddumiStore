import { Router } from 'express'
import { supabase } from '../utils/supabase.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validateUUID, validateSlug, parseFilters } from '../middleware/validation.js'
import { validate, paginationSchema } from '../utils/validation.js'
import { 
  buildPaginationQuery, 
  buildSortingQuery, 
  buildFilteringQuery,
  formatPaginatedResponse 
} from '../utils/helpers.js'

const router = Router()

// Get all products with filters and pagination
router.get('/',
  validate(paginationSchema),
  parseFilters,
  asyncHandler(async (req, res) => {
    const { page, pageSize, sort, locale } = req.validatedQuery
    const filters = req.parsedFilters

    // Build base query
    let query = supabase
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
      `, { count: 'exact' })
      .eq('is_active', true)

    // Apply filters
    query = buildFilteringQuery(query, filters)

    // Apply sorting
    query = buildSortingQuery(query, sort)

    // Apply pagination
    query = buildPaginationQuery(query, { page, pageSize })

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    // Set pagination headers
    res.set({
      'X-Total-Count': count,
      'X-Page': page,
      'X-Page-Size': pageSize
    })

    res.json(formatPaginatedResponse(data, page, pageSize, count))
  })
)

// Get featured products
router.get('/featured', asyncHandler(async (req, res) => {
  const locale = req.query.locale || 'ar'
  const limit = parseInt(req.query.limit) || 8

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
    .eq('is_active', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  res.json(data)
}))

// Get best sellers (simulate with featured + random selection)
router.get('/best-sellers', asyncHandler(async (req, res) => {
  const locale = req.query.locale || 'ar'
  const limit = parseInt(req.query.limit) || 8

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
    .eq('is_active', true)
    .gt('stock_qty', 0)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  res.json(data)
}))

// Get new arrivals
router.get('/new-arrivals', asyncHandler(async (req, res) => {
  const locale = req.query.locale || 'ar'
  const limit = parseInt(req.query.limit) || 8

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
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  res.json(data)
}))

// Get product by ID
router.get('/:id', validateUUID('id'), asyncHandler(async (req, res) => {
  const { id } = req.params
  const locale = req.query.locale || 'ar'

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
      stock_qty,
      min_stock,
      is_active,
      featured,
      warranty_months,
      energy_rating,
      model_number,
      specs,
      short_desc_ar,
      short_desc_en,
      long_desc_ar,
      long_desc_en,
      dimensions_cm,
      weight_kg,
      created_at,
      updated_at,
      brands!inner(
        id,
        name_ar,
        name_en,
        slug,
        logo_url
      ),
      categories!inner(
        id,
        name_ar,
        name_en,
        slug,
        description_ar,
        description_en
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
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    throw error
  }

  res.json(data)
}))

// Get product by slug
router.get('/slug/:slug', validateSlug('slug'), asyncHandler(async (req, res) => {
  const { slug } = req.params
  const locale = req.query.locale || 'ar'

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
      stock_qty,
      min_stock,
      is_active,
      featured,
      warranty_months,
      energy_rating,
      model_number,
      specs,
      short_desc_ar,
      short_desc_en,
      long_desc_ar,
      long_desc_en,
      dimensions_cm,
      weight_kg,
      created_at,
      updated_at,
      brands!inner(
        id,
        name_ar,
        name_en,
        slug,
        logo_url
      ),
      categories!inner(
        id,
        name_ar,
        name_en,
        slug,
        description_ar,
        description_en
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
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    throw error
  }

  res.json(data)
}))

// Get related products
router.get('/:id/related', validateUUID('id'), asyncHandler(async (req, res) => {
  const { id } = req.params
  const locale = req.query.locale || 'ar'
  const limit = parseInt(req.query.limit) || 4

  // First get the current product's category and brand
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('category_id, brand_id')
    .eq('id', id)
    .single()

  if (productError) {
    throw productError
  }

  // Get related products from same category, preferring same brand
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
    .eq('category_id', product.category_id)
    .neq('id', id)
    .eq('is_active', true)
    .order('brand_id', { ascending: product.brand_id ? false : true }) // Prefer same brand
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  res.json(data)
}))

export default router