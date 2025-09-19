import { Router } from 'express'
import { supabase } from '../utils/supabase.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validateUUID } from '../middleware/validation.js'

const router = Router()

// Get all active services
router.get('/', asyncHandler(async (req, res) => {
  const locale = req.query.locale || 'ar'

  const { data, error } = await supabase
    .from('services')
    .select(`
      id,
      code,
      name_ar,
      name_en,
      description_ar,
      description_en,
      price,
      applies_to_categories
    `)
    .eq('is_active', true)
    .order('code')

  if (error) {
    throw error
  }

  res.json(data)
}))

// Get service by ID
router.get('/:id', validateUUID('id'), asyncHandler(async (req, res) => {
  const { id } = req.params
  const locale = req.query.locale || 'ar'

  const { data, error } = await supabase
    .from('services')
    .select(`
      id,
      code,
      name_ar,
      name_en,
      description_ar,
      description_en,
      price,
      applies_to_categories
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    throw error
  }

  res.json(data)
}))

export default router