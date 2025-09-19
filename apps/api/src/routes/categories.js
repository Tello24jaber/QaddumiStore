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

// Get all categories with hierarchy
router.get('/', asyncHandler(async (req, res) => {
  const locale = req.query.locale || 'ar'
  
  const { data, error } = await supabase
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
      level,
      path
    `)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name_ar', { ascending: true })

  if (error) {
    throw error
  }

  res.json(data)
}))

// Get category by ID
router.get('/:id', validateUUID('id'), asyncHandler(async (req, res) => {
  const { id } = req.params
  const locale = req.query.locale || 'ar'

  const { data, error } = await supabase
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
      level,
      path
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    throw error
  }

  res.json(data)
}))

// Get category by slug
router.get('/slug/:slug', validateSlug('slug'), asyncHandler(async (req, res) => {
  const { slug } = req.params
  const locale = req.query.locale || 'ar'

  const { data, error } = await supabase
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
      level,
      path
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    throw error
  }

  res.json(data)
}))

// Get products in a category
router.get('/:id/products', 
  validateUUID('id'),
  validate(paginationSchema),
  parseFilters,
  asyncHandler(async (req, res) => {
    const { id } = req.params
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
      .eq('category_id', id)
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

export default router