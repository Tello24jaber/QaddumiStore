import { ValidationError } from './errorHandler.js'

export const validateUUID = (paramName) => {
  return (req, res, next) => {
    const uuid = req.params[paramName]
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    
    if (!uuidRegex.test(uuid)) {
      throw new ValidationError(`Invalid ${paramName} format`)
    }
    
    next()
  }
}

export const validateSlug = (paramName) => {
  return (req, res, next) => {
    const slug = req.params[paramName]
    const slugRegex = /^[a-z0-9-]+$/
    
    if (!slug || !slugRegex.test(slug) || slug.length > 255) {
      throw new ValidationError(`Invalid ${paramName} format`)
    }
    
    next()
  }
}

export const sanitizeQuery = (allowedParams = []) => {
  return (req, res, next) => {
    const sanitized = {}
    
    allowedParams.forEach(param => {
      if (req.query[param] !== undefined) {
        sanitized[param] = req.query[param]
      }
    })
    
    req.sanitizedQuery = sanitized
    next()
  }
}

export const parseFilters = (req, res, next) => {
  const filters = {}
  
  // Parse array filters
  if (req.query.brands) {
    filters.brands = Array.isArray(req.query.brands) ? req.query.brands : [req.query.brands]
  }
  
  if (req.query.categories) {
    filters.categories = Array.isArray(req.query.categories) ? req.query.categories : [req.query.categories]
  }
  
  if (req.query.energyRating) {
    filters.energyRating = Array.isArray(req.query.energyRating) ? req.query.energyRating : [req.query.energyRating]
  }
  
  // Parse numeric filters
  if (req.query.minPrice) {
    const minPrice = parseFloat(req.query.minPrice)
    if (!isNaN(minPrice) && minPrice >= 0) {
      filters.minPrice = minPrice
    }
  }
  
  if (req.query.maxPrice) {
    const maxPrice = parseFloat(req.query.maxPrice)
    if (!isNaN(maxPrice) && maxPrice >= 0) {
      filters.maxPrice = maxPrice
    }
  }
  
  // Parse boolean filters
  if (req.query.inStock !== undefined) {
    filters.inStock = req.query.inStock === 'true'
  }
  
  if (req.query.onSale !== undefined) {
    filters.onSale = req.query.onSale === 'true'
  }
  
  if (req.query.featured !== undefined) {
    filters.featured = req.query.featured === 'true'
  }
  
  req.parsedFilters = filters
  next()
}

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`)
  })
  
  next()
}