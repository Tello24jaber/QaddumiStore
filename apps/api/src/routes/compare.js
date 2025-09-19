import { Router } from 'express'
import { supabase } from '../utils/supabase.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { validateBody, compareSchema } from '../utils/validation.js'

const router = Router()

// Compare products
router.post('/',
  validateBody(compareSchema),
  asyncHandler(async (req, res) => {
    const { productIds, locale } = req.validatedBody

    // Get products with full details
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
        warranty_months,
        energy_rating,
        model_number,
        specs,
        short_desc_ar,
        short_desc_en,
        dimensions_cm,
        weight_kg,
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
      .in('id', productIds)
      .eq('is_active', true)

    if (error) {
      throw error
    }

    if (data.length !== productIds.length) {
      return res.status(400).json({
        error: 'Some products not found or inactive'
      })
    }

    // Extract all unique specification keys
    const allSpecs = new Set()
    
    data.forEach(product => {
      // Add common attributes
      allSpecs.add('brand')
      allSpecs.add('category')
      allSpecs.add('price')
      allSpecs.add('warranty_months')
      allSpecs.add('energy_rating')
      allSpecs.add('model_number')
      allSpecs.add('dimensions_cm')
      allSpecs.add('weight_kg')
      
      // Add specs from JSONB field
      if (product.specs && typeof product.specs === 'object') {
        Object.keys(product.specs).forEach(key => allSpecs.add(key))
      }
    })

    const specifications = Array.from(allSpecs).sort()

    res.json({
      products: data,
      specifications
    })
  })
)

export default router