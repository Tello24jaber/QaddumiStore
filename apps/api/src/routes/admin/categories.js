import { Router } from 'express'
import { supabase } from '../../utils/supabase.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { requireStaff } from '../../middleware/auth.js'
import { validateUUID } from '../../middleware/validation.js'
import { validateBody } from '../../utils/validation.js'
import { categoryCreateSchema } from '../../utils/validation.js'
import { generateSlug } from '../../utils/helpers.js'

const router = Router()

// All routes require staff authentication
router.use(requireStaff)

// Create category
router.post('/',
  validateBody(categoryCreateSchema),
  asyncHandler(async (req, res) => {
    const categoryData = req.validatedBody

    // Generate unique slug if not provided
    if (!categoryData.slug) {
      const baseSlug = categoryData.name_en.toLowerCase().replace(/[^a-z0-9]/g, '-')
      categoryData.slug = await generateSlug('categories', baseSlug)
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()

    if (error) {
      throw error
    }

    res.status(201).json(data)
  })
)

// Update category
router.put('/:id',
  validateUUID('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const updates = req.body

    // Remove fields that shouldn't be updated directly
    delete updates.id
    delete updates.created_at
    delete updates.path
    delete updates.level

    // Generate new slug if name changed
    if (updates.name_en && !updates.slug) {
      const baseSlug = updates.name_en.toLowerCase().replace(/[^a-z0-9]/g, '-')
      updates.slug = await generateSlug('categories', baseSlug, id)
    }

    const { data, error } = await supabase
      .from('categories')
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

// Delete category
router.delete('/:id',
  validateUUID('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params

    // Check if category has products
    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1)

    if (products && products.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with existing products'
      })
    }

    // Check if category has subcategories
    const { data: subcategories } = await supabase
      .from('categories')
      .select('id')
      .eq('parent_id', id)
      .limit(1)

    if (subcategories && subcategories.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with subcategories'
      })
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    res.json({ message: 'Category deleted successfully' })
  })
)

// Get all categories for admin (including inactive)
router.get('/', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
    .order('name_ar')

  if (error) {
    throw error
  }

  res.json(data)
}))

export default router