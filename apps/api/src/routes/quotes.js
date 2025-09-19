import { Router } from 'express'
import { supabase } from '../utils/supabase.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { quoteLimiter } from '../middleware/rateLimiter.js'
import { validateBody, validate, quoteSchema, paginationSchema } from '../utils/validation.js'
import { validateUUID } from '../middleware/validation.js'
import { requireStaff } from '../middleware/auth.js'

const router = Router()

// Create a quote request
router.post('/',
  quoteLimiter,
  validateBody(quoteSchema),
  asyncHandler(async (req, res) => {
    const { customer_name, phone, email, note, items, services } = req.validatedBody

    // Verify products exist and are active
    const productIds = items.map(item => item.product_id)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name_ar, name_en, price, sale_price, currency, stock_qty')
      .in('id', productIds)
      .eq('is_active', true)

    if (productsError) {
      throw productsError
    }

    if (products.length !== productIds.length) {
      return res.status(400).json({
        error: 'Some products are not available'
      })
    }

    // Calculate total amount
    let totalAmount = 0
    const quotedItems = items.map(item => {
      const product = products.find(p => p.id === item.product_id)
      const unitPrice = product.sale_price || product.price
      const itemTotal = unitPrice * item.quantity
      totalAmount += itemTotal

      return {
        product_id: item.product_id,
        product_name_ar: product.name_ar,
        product_name_en: product.name_en,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: itemTotal,
        currency: product.currency
      }
    })

    // Add services if any
    let quotedServices = []
    if (services && services.length > 0) {
      const { data: serviceData, error: servicesError } = await supabase
        .from('services')
        .select('id, name_ar, name_en, price')
        .in('id', services)
        .eq('is_active', true)

      if (servicesError) {
        throw servicesError
      }

      quotedServices = serviceData.map(service => {
        totalAmount += service.price
        return {
          service_id: service.id,
          service_name_ar: service.name_ar,
          service_name_en: service.name_en,
          price: service.price
        }
      })
    }

    // Create quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        customer_name,
        phone,
        email,
        note,
        items: quotedItems,
        services: quotedServices,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select()
      .single()

    if (quoteError) {
      throw quoteError
    }

    res.status(201).json({
      message: 'Quote request submitted successfully',
      quote: {
        id: quote.id,
        reference_number: quote.id.substring(0, 8).toUpperCase(),
        total_amount: totalAmount,
        status: quote.status,
        created_at: quote.created_at
      }
    })
  })
)

// Get all quotes (staff only)
router.get('/',
  requireStaff,
  validate(paginationSchema),
  asyncHandler(async (req, res) => {
    const { page, pageSize } = req.validatedQuery
    const offset = (page - 1) * pageSize

    const { data, error, count } = await supabase
      .from('quotes')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      throw error
    }

    res.set({
      'X-Total-Count': count,
      'X-Page': page,
      'X-Page-Size': pageSize
    })

    res.json({
      data,
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize)
      }
    })
  })
)

// Get quote by ID (staff only)
router.get('/:id',
  requireStaff,
  validateUUID('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    res.json(data)
  })
)

// Update quote status (staff only)
router.patch('/:id',
  requireStaff,
  validateUUID('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status, notes } = req.body

    const allowedStatuses = ['pending', 'contacted', 'quoted', 'converted', 'cancelled']
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status value'
      })
    }

    const updates = {}
    if (status) updates.status = status
    if (notes !== undefined) updates.notes = notes

    const { data, error } = await supabase
      .from('quotes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    res.json(data)
  })
)

export default router
