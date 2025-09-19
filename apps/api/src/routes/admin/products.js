import { Router } from 'express'
import { supabase } from '../../utils/supabase.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { requireStaff } from '../../middleware/auth.js'
import { validateUUID } from '../../middleware/validation.js'
import { validateBody } from '../../utils/validation.js'
import { productCreateSchema } from '../../utils/validation.js'
import { generateSlug } from '../../utils/helpers.js'

const router = Router()

// All routes require staff authentication
router.use(requireStaff)

// Create product
router.post('/',
  validateBody(productCreateSchema),
  asyncHandler(async (req, res) => {
    const productData = req.validatedBody

    // Generate unique slug if not provided
    if (!productData.slug) {
      const baseSlug = productData.name_en.toLowerCase().replace(/[^a-z0-9]/g, '-')
      productData.slug = await generateSlug('products', baseSlug)
    }

    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      throw error
    }

    res.status(201).json(data)
  })
)

// Update product
router.put('/:id',
  validateUUID('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const updates = req.body

    // Remove fields that shouldn't be updated directly
    delete updates.id
    delete updates.created_at

    // Generate new slug if name changed
    if (updates.name_en && !updates.slug) {
      const baseSlug = updates.name_en.toLowerCase().replace(/[^a-z0-9]/g, '-')
      updates.slug = await generateSlug('products', baseSlug, id)
    }

    const { data, error } = await supabase
      .from('products')
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

// Delete product
router.delete('/:id',
  validateUUID('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params

    // Soft delete by setting is_active to false
    const { data, error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    res.json({ message: 'Product deleted successfully' })
  })
)

// Get all products for admin (including inactive)
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.pageSize) || 20
  const offset = (page - 1) * pageSize

  const { data, error, count } = await supabase
    .from('products')
    .select(`
      id,
      sku,
      name_ar,
      name_en,
      slug,
      price,
      sale_price,
      stock_qty,
      is_active,
      featured,
      created_at,
      updated_at,
      brands!inner(name_ar, name_en),
      categories!inner(name_ar, name_en)
    `, { count: 'exact' })
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
}))

// Bulk update products
router.patch('/bulk',
  asyncHandler(async (req, res) => {
    const { productIds, updates } = req.body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        error: 'Product IDs are required'
      })
    }

    // Remove sensitive fields
    delete updates.id
    delete updates.created_at
    delete updates.updated_at

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .in('id', productIds)
      .select()

    if (error) {
      throw error
    }

    res.json({
      message: `${data.length} products updated successfully`,
      updatedProducts: data
    })
  })
)

export default router