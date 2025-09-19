import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  HeartIcon,
  ScaleIcon,
  ShoppingCartIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useCartStore } from '../../store/cartStore'
import { useCompareStore } from '../../store/compareStore'
import { formatPrice, getImageUrl, generateWhatsAppUrl } from '../../lib/utils'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'

const ProductCard = ({ 
  product, 
  showBadge = false, 
  badgeText = '', 
  badgeColor = 'bg-red-500',
  className = '' 
}) => {
  const { t, i18n } = useTranslation()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  
  const { addItem, openCart } = useCartStore()
  const { addItem: addToCompare, isInCompare } = useCompareStore()

  const getProductName = () => {
    return i18n.language === 'ar' ? product.name_ar : product.name_en
  }

  const getProductDescription = () => {
    return i18n.language === 'ar' ? product.short_desc_ar : product.short_desc_en
  }

  const getBrandName = () => {
    if (product.brands) {
      return i18n.language === 'ar' ? product.brands.name_ar : product.brands.name_en
    }
    return product.brand_name || ''
  }

  const getPrimaryImage = () => {
    if (product.media && product.media.length > 0) {
      const primaryImage = product.media.find(img => img.is_primary) || product.media[0]
      return primaryImage.url
    }
    return null
  }

  const getImageAlt = () => {
    if (product.media && product.media.length > 0) {
      const primaryImage = product.media.find(img => img.is_primary) || product.media[0]
      return i18n.language === 'ar' ? primaryImage.alt_ar : primaryImage.alt_en
    }
    return getProductName()
  }

  const currentPrice = product.sale_price || product.price
  const originalPrice = product.sale_price ? product.price : null
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (import.meta.env.VITE_ENABLE_CART === 'true') {
      addItem(product)
      toast.success(`تم إضافة ${getProductName()} إلى السلة`)
      openCart()
    } else {
      // Redirect to WhatsApp for quote
      const message = `مرحبا، أريد الاستفسار عن هذا المنتج:
${getProductName()}
رمز المنتج: ${product.sku}
السعر: ${formatPrice(currentPrice, product.currency, i18n.language)}`
      
      const whatsappUrl = generateWhatsAppUrl(
        import.meta.env.VITE_WHATSAPP_NUMBER,
        message,
        i18n.language
      )
      
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleAddToCompare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const result = addToCompare(product)
    if (result.success) {
      toast.success(result.message || 'تم إضافة المنتج للمقارنة')
    } else {
      toast.error(result.message || 'فشل في إضافة المنتج للمقارنة')
    }
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsWishlisted(!isWishlisted)
    toast.success(
      isWishlisted 
        ? 'تم إزالة المنتج من المفضلة' 
        : 'تم إضافة المنتج إلى المفضلة'
    )
  }

  const isOutOfStock = product.stock_qty <= 0
  const isLowStock = product.stock_qty > 0 && product.stock_qty <= product.min_stock

  return (
    <div className={`product-card relative ${className}`}>
      {/* Product Link */}
      <Link to={`/p/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
          {/* Product Image */}
          {getPrimaryImage() ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-qaddumi-gold"></div>
                </div>
              )}
              <img
                src={getImageUrl(getPrimaryImage())}
                alt={getImageAlt()}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col space-y-2">
            {showBadge && badgeText && (
              <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${badgeColor}`}>
                {badgeText}
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -{discountPercentage}%
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {t('product.outOfStock')}
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {t('product.limitedStock')}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Wishlist */}
            <button
              onClick={handleToggleWishlist}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              aria-label="Add to wishlist"
            >
              {isWishlisted ? (
                <HeartSolidIcon className="w-4 h-4 text-red-500" />
              ) : (
                <HeartIcon className="w-4 h-4 text-gray-600 hover:text-red-500" />
              )}
            </button>

            {/* Compare */}
            <button
              onClick={handleAddToCompare}
              className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all ${
                isInCompare(product.id) ? 'bg-qaddumi-gold' : ''
              }`}
              aria-label="Add to compare"
            >
              <ScaleIcon className={`w-4 h-4 ${
                isInCompare(product.id) ? 'text-qaddumi-charcoal' : 'text-gray-600 hover:text-qaddumi-gold'
              }`} />
            </button>

            {/* Quick View */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // TODO: Implement quick view modal
                toast.info('المعاينة السريعة - قريباً')
              }}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              aria-label="Quick view"
            >
              <EyeIcon className="w-4 h-4 text-gray-600 hover:text-blue-500" />
            </button>
          </div>

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Brand */}
          {getBrandName() && (
            <p className="text-sm text-gray-500 font-medium">
              {getBrandName()}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 group-hover:text-qaddumi-gold transition-colors line-clamp-2">
            {getProductName()}
          </h3>

          {/* Description */}
          {getProductDescription() && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {getProductDescription()}
            </p>
          )}

          {/* Features/Specs */}
          {product.energy_rating && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-xs text-gray-500">تصنيف الطاقة:</span>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                {product.energy_rating}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="price-current">
              {formatPrice(currentPrice, product.currency, i18n.language)}
            </span>
            {originalPrice && (
              <span className="price-original">
                {formatPrice(originalPrice, product.currency, i18n.language)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
            {isOutOfStock ? (
              <span className="text-red-600 font-medium">{t('product.outOfStock')}</span>
            ) : isLowStock ? (
              <span className="text-orange-600 font-medium">{t('product.limitedStock')}</span>
            ) : (
              <span className="text-green-600 font-medium">{t('product.inStock')}</span>
            )}
            {product.stock_qty > 0 && product.stock_qty <= 10 && (
              <span className="text-xs text-gray-500">
                ({product.stock_qty} متبقي)
              </span>
            )}
          </div>

          {/* Warranty */}
          {product.warranty_months && (
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>ضمان {product.warranty_months} شهر</span>
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="mt-4">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-qaddumi-gold hover:bg-qaddumi-gold-dark text-qaddumi-charcoal hover:shadow-md'
          }`}
        >
          {import.meta.env.VITE_ENABLE_CART === 'true' ? (
            <>
              <ShoppingCartIcon className="w-4 h-4" />
              <span>{isOutOfStock ? t('product.outOfStock') : t('product.addToCart')}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>{isOutOfStock ? t('product.outOfStock') : t('product.requestQuote')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    sku: PropTypes.string.isRequired,
    name_ar: PropTypes.string.isRequired,
    name_en: PropTypes.string.isRequired,
    short_desc_ar: PropTypes.string,
    short_desc_en: PropTypes.string,
    price: PropTypes.number.isRequired,
    sale_price: PropTypes.number,
    currency: PropTypes.string,
    stock_qty: PropTypes.number,
    min_stock: PropTypes.number,
    warranty_months: PropTypes.number,
    energy_rating: PropTypes.string,
    brands: PropTypes.shape({
      name_ar: PropTypes.string,
      name_en: PropTypes.string,
    }),
    media: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        alt_ar: PropTypes.string,
        alt_en: PropTypes.string,
        is_primary: PropTypes.bool,
      })
    ),
  }).isRequired,
  showBadge: PropTypes.bool,
  badgeText: PropTypes.string,
  badgeColor: PropTypes.string,
  className: PropTypes.string,
}

export default ProductCard