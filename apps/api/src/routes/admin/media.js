import { Router } from 'express'
import multer from 'multer'
import sharp from 'sharp'
import { supabase } from '../../utils/supabase.js'
import { asyncHandler } from '../../middleware/errorHandler.js'
import { requireStaff } from '../../middleware/auth.js'
import { validateUUID } from '../../middleware/validation.js'

const router = Router()

// All routes require staff authentication
router.use(requireStaff)

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // Max 10 files at once
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Upload product images
router.post('/upload/product/:productId',
  validateUUID('productId'),
  upload.array('images', 10),
  asyncHandler(async (req, res) => {
    const { productId } = req.params
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded'
      })
    }

    // Verify product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name_ar, name_en')
      .eq('id', productId)
      .single()

    if (productError) {
      throw productError
    }

    const uploadedImages = []

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i]
      
      // Process image with sharp
      const processedImage = await sharp(file.buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer()

      // Generate filename
      const filename = `${productId}-${Date.now()}-${i + 1}.jpg`
      const filepath = `products/${filename}`

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filepath, processedImage, {
          contentType: 'image/jpeg',
          cacheControl: '3600'
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filepath)

      // Save to media table
      const { data: mediaRecord, error: mediaError } = await supabase
        .from('media')
        .insert({
          product_id: productId,
          url: urlData.publicUrl,
          alt_ar: product.name_ar,
          alt_en: product.name_en,
          is_primary: i === 0, // First image is primary
          sort_order: i
        })
        .select()
        .single()

      if (!mediaError) {
        uploadedImages.push(mediaRecord)
      }
    }

    res.json({
      message: `${uploadedImages.length} images uploaded successfully`,
      images: uploadedImages
    })
  })
)

// Delete media
router.delete('/:id',
  validateUUID('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params

    // Get media record
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('url')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // Extract file path from URL
    const urlParts = media.url.split('/')
    const bucket = urlParts[urlParts.length - 2]
    const filename = urlParts[urlParts.length - 1]
    const filepath = `${bucket}/${filename}`

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('products')
      .remove([filepath])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id)

    if (dbError) {
      throw dbError
    }

    res.json({ message: 'Media deleted successfully' })
  })
)

// Update media (reorder, change alt text, set primary)
router.patch('/:id',
  validateUUID('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const { alt_ar, alt_en, is_primary, sort_order } = req.body

    const updates = {}
    if (alt_ar !== undefined) updates.alt_ar = alt_ar
    if (alt_en !== undefined) updates.alt_en = alt_en
    if (is_primary !== undefined) updates.is_primary = is_primary
    if (sort_order !== undefined) updates.sort_order = sort_order

    // If setting as primary, unset other primary images for this product
    if (is_primary === true) {
      const { data: media } = await supabase
        .from('media')
        .select('product_id')
        .eq('id', id)
        .single()

      if (media) {
        await supabase
          .from('media')
          .update({ is_primary: false })
          .eq('product_id', media.product_id)
          .neq('id', id)
      }
    }

    const { data, error } = await supabase
      .from('media')
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