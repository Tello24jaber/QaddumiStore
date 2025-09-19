import Joi from 'joi'

// Common validation schemas
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().valid('popularity', 'newest', 'price_asc', 'price_desc', 'name_asc', 'name_desc').default('popularity'),
  locale: Joi.string().valid('ar', 'en').default('ar')
})

export const filterSchema = Joi.object({
  brands: Joi.array().items(Joi.string().uuid()),
  categories: Joi.array().items(Joi.string().uuid()),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  inStock: Joi.boolean(),
  onSale: Joi.boolean(),
  featured: Joi.boolean(),
  energyRating: Joi.array().items(Joi.string()),
})

export const searchSchema = Joi.object({
  q: Joi.string().min(1).max(255).required(),
  locale: Joi.string().valid('ar', 'en').default('ar'),
  limit: Joi.number().integer().min(1).max(50).default(10)
})

export const compareSchema = Joi.object({
  productIds: Joi.array().items(Joi.string().uuid()).min(2).max(4).required(),
  locale: Joi.string().valid('ar', 'en').default('ar')
})

export const quoteSchema = Joi.object({
  customer_name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required(),
  email: Joi.string().email().optional(),
  note: Joi.string().max(1000).optional(),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).default(1)
    })
  ).min(1).required(),
  services: Joi.array().items(Joi.string().uuid()).optional()
})

export const productCreateSchema = Joi.object({
  sku: Joi.string().min(3).max(50).required(),
  name_ar: Joi.string().min(3).max(255).required(),
  name_en: Joi.string().min(3).max(255).required(),
  slug: Joi.string().min(3).max(255).required(),
  brand_id: Joi.string().uuid().required(),
  category_id: Joi.string().uuid().required(),
  price: Joi.number().min(0).required(),
  sale_price: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).default('ILS'),
  stock_qty: Joi.number().integer().min(0).default(0),
  is_active: Joi.boolean().default(true),
  featured: Joi.boolean().default(false),
  warranty_months: Joi.number().integer().min(0).default(12),
  energy_rating: Joi.string().max(10).optional(),
  short_desc_ar: Joi.string().max(500).optional(),
  short_desc_en: Joi.string().max(500).optional(),
  long_desc_ar: Joi.string().max(5000).optional(),
  long_desc_en: Joi.string().max(5000).optional(),
  specs: Joi.object().optional()
})

export const categoryCreateSchema = Joi.object({
  parent_id: Joi.string().uuid().optional(),
  name_ar: Joi.string().min(2).max(255).required(),
  name_en: Joi.string().min(2).max(255).required(),
  slug: Joi.string().min(2).max(255).required(),
  description_ar: Joi.string().max(1000).optional(),
  description_en: Joi.string().max(1000).optional(),
  icon: Joi.string().max(50).optional(),
  is_active: Joi.boolean().default(true),
  featured: Joi.boolean().default(false),
  sort_order: Joi.number().integer().min(0).default(0)
})

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query)
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      })
    }
    req.validatedQuery = value
    next()
  }
}

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      })
    }
    req.validatedBody = value
    next()
  }
}
