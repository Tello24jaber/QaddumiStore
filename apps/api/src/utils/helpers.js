import { supabase } from './supabase.js'

// Build pagination query
export const buildPaginationQuery = (query, { page, pageSize }) => {
  const offset = (page - 1) * pageSize
  return query.range(offset, offset + pageSize - 1)
}

// Build sorting query
export const buildSortingQuery = (query, sort) => {
  switch (sort) {
    case 'newest':
      return query.order('created_at', { ascending: false })
    case 'price_asc':
      return query.order('price', { ascending: true })
    case 'price_desc':
      return query.order('price', { ascending: false })
    case 'name_asc':
      return query.order('name_ar', { ascending: true })
    case 'name_desc':
      return query.order('name_ar', { ascending: false })
    case 'popularity':
    default:
      return query.order('featured', { ascending: false }).order('created_at', { ascending: false })
  }
}

// Build filtering query
export const buildFilteringQuery = (query, filters = {}) => {
  let filteredQuery = query

  if (filters.brands && filters.brands.length > 0) {
    filteredQuery = filteredQuery.in('brand_id', filters.brands)
  }

  if (filters.categories && filters.categories.length > 0) {
    filteredQuery = filteredQuery.in('category_id', filters.categories)
  }

  if (filters.minPrice !== undefined) {
    filteredQuery = filteredQuery.gte('price', filters.minPrice)
  }

  if (filters.maxPrice !== undefined) {
    filteredQuery = filteredQuery.lte('price', filters.maxPrice)
  }

  if (filters.inStock === true) {
    filteredQuery = filteredQuery.gt('stock_qty', 0)
  }

  if (filters.onSale === true) {
    filteredQuery = filteredQuery.not('sale_price', 'is', null)
  }

  if (filters.featured === true) {
    filteredQuery = filteredQuery.eq('featured', true)
  }

  if (filters.energyRating && filters.energyRating.length > 0) {
    filteredQuery = filteredQuery.in('energy_rating', filters.energyRating)
  }

  return filteredQuery
}

// Format response with pagination info
export const formatPaginatedResponse = (data, page, pageSize, total) => {
  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: page * pageSize < total,
      hasPreviousPage: page > 1
    }
  }
}

// Generate unique slug
export const generateSlug = async (tableName, baseSlug, excludeId = null) => {
  let slug = baseSlug.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, '-').replace(/-+/g, '-')
  let counter = 0
  let finalSlug = slug

  while (true) {
    let query = supabase.from(tableName).select('id').eq('slug', finalSlug)
    
    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    if (data.length === 0) {
      break
    }

    counter++
    finalSlug = `${slug}-${counter}`
  }

  return finalSlug
}