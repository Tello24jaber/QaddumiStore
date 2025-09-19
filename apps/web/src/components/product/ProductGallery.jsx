import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { getImageUrl } from '../../lib/utils'
import Modal from '../common/Modal'
import PropTypes from 'prop-types'

const ProductGallery = ({ media = [], productName = '' }) => {
  const { i18n } = useTranslation()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)

  // Sort media by sort_order and is_primary
  const sortedMedia = [...media].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return (a.sort_order || 0) - (b.sort_order || 0)
  })

  const currentImage = sortedMedia[currentImageIndex]
  const isRTL = i18n.language === 'ar'

  const getImageAlt = (image) => {
    if (!image) return productName
    return i18n.language === 'ar' ? image.alt_ar : image.alt_en || productName
  }

  const goToImage = (index) => {
    if (index >= 0 && index < sortedMedia.length) {
      setCurrentImageIndex(index)
      setIsImageLoading(true)
    }
  }

  const goToPrevious = () => {
    const newIndex = currentImageIndex === 0 ? sortedMedia.length - 1 : currentImageIndex - 1
    goToImage(newIndex)
  }

  const goToNext = () => {
    const newIndex = currentImageIndex === sortedMedia.length - 1 ? 0 : currentImageIndex + 1
    goToImage(newIndex)
  }

  const openZoom = () => {
    setIsZoomOpen(true)
  }

  if (!sortedMedia.length) {
    return (
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-sm">لا توجد صور</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-qaddumi-gold"></div>
          </div>
        )}
        
        <img
          src={getImageUrl(currentImage?.url)}
          alt={getImageAlt(currentImage)}
          className={`w-full h-full object-cover cursor-zoom-in transition-opacity duration-300 ${
            isImageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={openZoom}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />

        {/* Zoom Icon */}
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={openZoom}
            className="w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all"
            aria-label="Zoom image"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Arrows */}
        {sortedMedia.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Previous image"
            >
              {isRTL ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Next image"
            >
              {isRTL ? (
                <ChevronLeftIcon className="w-5 h-5" />
              ) : (
                <ChevronRightIcon className="w-5 h-5" />
              )}
            </button>
          </>
        )}

        {/* Image Counter */}
        {sortedMedia.length > 1 && (
          <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {sortedMedia.length}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {sortedMedia.length > 1 && (
        <div className="flex space-x-2 rtl:space-x-reverse overflow-x-auto pb-2">
          {sortedMedia.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-qaddumi-gold ring-2 ring-qaddumi-gold ring-opacity-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={getImageUrl(image.url)}
                alt={getImageAlt(image)}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        size="full"
        showCloseButton={true}
        className="bg-black"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative max-w-full max-h-full">
            <img
              src={getImageUrl(currentImage?.url)}
              alt={getImageAlt(currentImage)}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Navigation in Zoom */}
            {sortedMedia.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full flex items-center justify-center transition-all"
                >
                  {isRTL ? (
                    <ChevronRightIcon className="w-6 h-6" />
                  ) : (
                    <ChevronLeftIcon className="w-6 h-6" />
                  )}
                </button>
                
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full flex items-center justify-center transition-all"
                >
                  {isRTL ? (
                    <ChevronLeftIcon className="w-6 h-6" />
                  ) : (
                    <ChevronRightIcon className="w-6 h-6" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

ProductGallery.propTypes = {
  media: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      alt_ar: PropTypes.string,
      alt_en: PropTypes.string,
      is_primary: PropTypes.bool,
      sort_order: PropTypes.number,
    })
  ),
  productName: PropTypes.string,
}

export default ProductGallery
