import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import {
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

// Components
import ProductGallery from '../../components/product/ProductGallery'
import SpecsTable from '../../components/product/SpecsTable'
import PriceBlock from '../../components/product/PriceBlock'
import CompareButton from '../../components/product/CompareButton'
import ServiceAddons from '../../components/product/ServiceAddons'
import ProductCard from '../../components/product/ProductCard'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import WhatsAppButton from '../../components/common/WhatsAppButton'

// API and utilities
import { productsAPI } from '../../lib/api'
import { generateProductSEO } from '../../lib/seo'
import { formatPrice, generateWhatsAppUrl } from '../../lib/utils'
import { useCartStore } from '../../store/cartStore'
import toast from 'react-hot-toast'

const ProductPage = () => {
  const { productSlug } = useParams()
  const { t, i18n } = useTranslation()
  
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        
        // Fetch product by slug
        const productData = await productsAPI.getBySlug(productSlug, i18n.language)
        setProduct(productData)

        // Fetch related products
        const relatedData = await productsAPI.getRelated(productData.id, i18n.language, 4)
        setRelatedProducts(relatedData)

        setError(null)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product')
      } finally {
        setIsLoading(false)
      }
    }

    if (productSlug) {
      fetchProduct()
    }
  }, [productSlug, i18n.language])

  const getProductName = () => {
    return i18n.language === 'ar' ? product?.name_ar : product?.name_en
  }

  const getProductDescription = (type = 'short') => {
    const field = `${type}_desc_${i18n.language}`
    return product?.[field] || ''
  }

  const getBrandName = () => {
    if (product?.brands) {
      return i18n.language === 'ar' ? product.brands.name_ar : product.brands.name_en
    }
    return ''
  }

  const getCategoryName = () => {
    if (product?.categories) {
      return i18n.language === 'ar' ? product.categories.name_ar : product.categories.name_en
    }
    return ''
  }

  const isOutOfStock = product?.stock_qty <= 0
  const isLowStock = product?.stock_qty > 0 && product?.stock_qty <= (product?.min_stock || 5)

  const handleAddToCart = () => {
    if (import.meta.env.VITE_ENABLE_CART === 'true') {
      const cartItem = { ...product, quantity }
      addItem(cartItem, quantity)
      toast.success(`تم إضافة ${getProductName()} إلى السلة`)
      openCart()
    } else {
      handleWhatsAppOrder()
    }
  }

  const handleWhatsAppOrder = () => {
    const servicesText = selectedServices.length > 0 
      ? `\n\nالخدمات المطلوبة:\n${selectedServices.map(s => `• ${i18n.language === 'ar' ? s.name_ar : s.name_en}`).join('\n')}`
      : ''

    const message = `مرحبا، أريد طلب هذا المنتج:

${getProductName()}
العلامة التجارية: ${getBrandName()}
رمز المنتج: ${product?.sku}
الكمية: ${quantity}
السعر: ${formatPrice(product?.sale_price || product?.price, product?.currency, i18n.language)}${servicesText}

يرجى تزويدي بالتفاصيل والتوفر.
شكراً`

    const whatsappUrl = generateWhatsAppUrl(
      import.meta.env.VITE_WHATSAPP_NUMBER,
      message,
      i18n.language
    )
    
    window.open(whatsappUrl, '_blank')
  }

  const handleShare = async () => {
    const shareData = {
      title: getProductName(),
      text: getProductDescription(),
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      toast.success('تم نسخ رابط المنتج')
    }
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(
      isWishlisted 
        ? 'تم إزالة المنتج من المفضلة' 
        : 'تم إضافة المنتج إلى المفضلة'
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="جاري تحميل المنتج..." />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container-qaddumi py-16">
        <ErrorMessage
          title="خطأ في تحميل المنتج"
          message={error || 'المنتج غير موجود'}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  // Generate SEO data
  const seo = generateProductSEO(product, i18n.language)

  // Breadcrumb items
  const breadcrumbItems = [
    {
      name: getCategoryName(),
      href: `/c/${product.categories.slug}`
    },
    {
      name: getProductName()
    }
  ]

  const tabs = [
    { key: 'description', label: 'الوصف' },
    { key: 'specifications', label: 'المواصفات' },
    { key: 'warranty', label: 'الضمان' },
    { key: 'reviews', label: 'التقييمات' }
  ]

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        {seo.meta.map((meta, index) => (
          <meta key={index} {...meta} />
        ))}
        {seo.link?.map((link, index) => (
          <link key={index} {...link} />
        ))}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(seo.structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container-qaddumi py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} className="mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Gallery */}
            <div>
              <ProductGallery 
                media={product.media || []} 
                productName={getProductName()} 
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand */}
              {getBrandName() && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{getBrandName()}</span>
                </div>
              )}

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {getProductName()}
              </h1>

              {/* Short Description */}
              {getProductDescription('short') && (
                <p className="text-lg text-gray-700 leading-relaxed">
                  {getProductDescription('short')}
                </p>
              )}

              {/* Price */}
              <div className="bg-white rounded-lg p-6 shadow-soft">
                <PriceBlock
                  price={product.price}
                  salePrice={product.sale_price}
                  currency={product.currency}
                  size="xl"
                />
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isOutOfStock 
                    ? 'bg-red-100 text-red-800'
                    : isLowStock 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {isOutOfStock ? (
                    <>
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2 rtl:mr-0 rtl:ml-2"></span>
                      {t('product.outOfStock')}
                    </>
                  ) : isLowStock ? (
                    <>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 rtl:mr-0 rtl:ml-2"></span>
                      {t('product.limitedStock')}
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 rtl:mr-0 rtl:ml-2"></span>
                      {t('product.inStock')}
                    </>
                  )}
                </div>

                {product.stock_qty > 0 && product.stock_qty <= 10 && (
                  <span className="text-sm text-gray-500">
                    ({product.stock_qty} متبقي)
                  </span>
                )}
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4">
                {product.energy_rating && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm text-gray-600">تصنيف الطاقة:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      {product.energy_rating}
                    </span>
                  </div>
                )}
                
                {product.warranty_months && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <ShieldCheckIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      ضمان {product.warranty_months} شهر
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity Selector & Actions */}
              <div className="space-y-4">
                {!isOutOfStock && (
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <label className="text-sm font-medium text-gray-700">
                      الكمية:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock_qty}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-0 focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stock_qty, quantity + 1))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-qaddumi-gold hover:bg-qaddumi-gold-dark text-qaddumi-charcoal hover:shadow-lg'
                    }`}
                  >
                    {import.meta.env.VITE_ENABLE_CART === 'true' ? (
                      <>
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>{isOutOfStock ? t('product.outOfStock') : t('product.addToCart')}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        <span>{isOutOfStock ? t('product.outOfStock') : 'اطلب عبر واتساب'}</span>
                      </>
                    )}
                  </button>

                  <CompareButton product={product} size="lg" className="w-full py-4" />
                </div>

                {/* Secondary Actions */}
                <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse pt-4 border-t">
                  <button
                    onClick={handleWishlistToggle}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-red-500 transition-colors"
                  >
                    {isWishlisted ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    <span className="text-sm">أضف للمفضلة</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <ShareIcon className="w-5 h-5" />
                    <span className="text-sm">مشاركة</span>
                  </button>

                  <WhatsAppButton
                    phone={import.meta.env.VITE_WHATSAPP_NUMBER}
                    message={`مرحبا، أريد الاستفسار عن ${getProductName()}`}
                    className="text-green-600 hover:text-green-700"
                    size="sm"
                  >
                    <span className="text-sm">واتساب</span>
                  </WhatsAppButton>
                </div>
              </div>

              {/* Delivery & Service Info */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <TruckIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    توصيل مجاني داخل طولكرم والقرى المجاورة
                  </span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    متوفر خدمة التركيب والتشغيل
                  </span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    ضمان معتمد مع خدمة ما بعد البيع
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Addons */}
          <div className="mb-16">
            <ServiceAddons
              productId={product.id}
              categoryId={product.category_id}
              selectedServices={selectedServices}
              onServiceChange={setSelectedServices}
            />
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-lg shadow-soft mb-16">
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 rtl:space-x-reverse px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-qaddumi-gold text-qaddumi-gold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none">
                  {getProductDescription('long') ? (
                    <div dangerouslySetInnerHTML={{ __html: getProductDescription('long') }} />
                  ) : (
                    <p>{getProductDescription('short')}</p>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <SpecsTable product={product} />
              )}

              {activeTab === 'warranty' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">معلومات الضمان</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">فترة الضمان</h4>
                      <p className="text-gray-600">
                        {product.warranty_months} شهر من تاريخ الشراء
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">نوع الضمان</h4>
                      <p className="text-gray-600">ضمان شامل من الشركة المصنعة</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">الصيانة</h4>
                      <p className="text-gray-600">خدمة صيانة معتمدة في طولكرم</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">استبدال الأجزاء</h4>
                      <p className="text-gray-600">قطع غيار أصلية متوفرة</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-8 text-gray-500">
                  <p>نظام التقييمات قيد التطوير</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                منتجات ذات صلة
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductPage