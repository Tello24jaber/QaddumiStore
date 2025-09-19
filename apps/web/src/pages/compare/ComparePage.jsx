import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import {
  XMarkIcon,
  ArrowPathIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline'

// Components
import PriceBlock from '../../components/product/PriceBlock'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import WhatsAppButton from '../../components/common/WhatsAppButton'

// Store and utilities
import { useCompareStore } from '../../store/compareStore'
import { useCartStore } from '../../store/cartStore'
import { compareAPI } from '../../lib/api'
import { getImageUrl, formatPrice, generateWhatsAppUrl } from '../../lib/utils'
import { generateSEO } from '../../lib/seo'
import toast from 'react-hot-toast'

const ComparePage = () => {
  const { t, i18n } = useTranslation()
  const { items, removeItem, clearAll } = useCompareStore()
  const { addItem: addToCart } = useCartStore()
  
  const [comparisonData, setComparisonData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false)

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (items.length < 2) {
        setComparisonData(null)
        return
      }

      try {
        setIsLoading(true)
        const productIds = items.map(item => item.id)
        const data = await compareAPI.compare(productIds, i18n.language)
        setComparisonData(data)
      } catch (error) {
        console.error('Error fetching comparison data:', error)
        toast.error('حدث خطأ في تحميل بيانات المقارنة')
      } finally {
        setIsLoading(false)
      }
    }

    fetchComparisonData()
  }, [items, i18n.language])

  const getProductName = (product) => {
    return i18n.language === 'ar' ? product.name_ar : product.name_en
  }

  const getBrandName = (product) => {
    if (product.brands) {
      return i18n.language === 'ar' ? product.brands.name_ar : product.brands.name_en
    }
    return ''
  }

  const getSpecValue = (product, specKey) => {
    // Handle common product properties
    switch (specKey) {
      case 'brand':
        return getBrandName(product)
      case 'category':
        return i18n.language === 'ar' ? product.categories?.name_ar : product.categories?.name_en
      case 'price':
        return formatPrice(product.sale_price || product.price, product.currency, i18n.language)
      case 'warranty_months':
        return product.warranty_months ? `${product.warranty_months} شهر` : '-'
      case 'energy_rating':
        return product.energy_rating || '-'
      case 'model_number':
        return product.model_number || '-'
      case 'dimensions_cm':
        return product.dimensions_cm ? `${product.dimensions_cm} سم` : '-'
      case 'weight_kg':
        return product.weight_kg ? `${product.weight_kg} كغ` : '-'
      default:
        // Check if it's in the specs JSONB field
        if (product.specs && product.specs[specKey]) {
          return product.specs[specKey]
        }
        return '-'
    }
  }

  const getSpecName = (specKey) => {
    const specNames = {
      brand: 'العلامة التجارية',
      category: 'الفئة',
      price: 'السعر',
      warranty_months: 'الضمان',
      energy_rating: 'تصنيف الطاقة',
      model_number: 'رقم الموديل',
      dimensions_cm: 'الأبعاد',
      weight_kg: 'الوزن',
    }
    
    return specNames[specKey] || specKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const handleAddToCart = (product) => {
    if (import.meta.env.VITE_ENABLE_CART === 'true') {
      addToCart(product)
      toast.success(`تم إضافة ${getProductName(product)} إلى السلة`)
    } else {
      // Redirect to WhatsApp
      const message = `مرحبا، أريد طلب هذا المنتج:\n${getProductName(product)}\nرقم المنتج: ${product.sku}`
      const whatsappUrl = generateWhatsAppUrl(import.meta.env.VITE_WHATSAPP_NUMBER, message)
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleCompareAll = () => {
    const message = `مرحبا، أريد المقارنة بين هذه المنتجات:\n\n${items.map((product, index) => 
      `${index + 1}. ${getProductName(product)} - ${formatPrice(product.sale_price || product.price, product.currency, i18n.language)}`
    ).join('\n')}\n\nيرجى تزويدي بالمقارنة التفصيلية والأسعار.`
    
    const whatsappUrl = generateWhatsAppUrl(import.meta.env.VITE_WHATSAPP_NUMBER, message)
    window.open(whatsappUrl, '_blank')
  }

  // Filter specifications to show only differences if toggle is active
  const getFilteredSpecs = () => {
    if (!comparisonData || !showOnlyDifferences) {
      return comparisonData?.specifications || []
    }

    return comparisonData.specifications.filter(specKey => {
      const values = comparisonData.products.map(product => getSpecValue(product, specKey))
      const uniqueValues = [...new Set(values)]
      return uniqueValues.length > 1 // Show only specs with different values
    })
  }

  const isOutOfStock = (product) => product.stock_qty <= 0

  // SEO data
  const seo = generateSEO({
    title: 'مقارنة المنتجات',
    description: 'قارن بين المنتجات المختلفة لاختيار الأنسب لك',
    url: '/compare'
  })

  const breadcrumbItems = [{ name: 'مقارنة المنتجات' }]

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>{seo.title}</title>
          {seo.meta.map((meta, index) => (
            <meta key={index} {...meta} />
          ))}
        </Helmet>

        <div className="container-qaddumi py-16">
          <Breadcrumbs items={breadcrumbItems} className="mb-8" />
          
          <EmptyState
            type="general"
            title="لا توجد منتجات للمقارنة"
            description="اختر منتجين على الأقل من صفحات المنتجات لبدء المقارنة"
            actionText="تصفح المنتجات"
            actionHref="/products"
          />
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        {seo.meta.map((meta, index) => (
          <meta key={index} {...meta} />
        ))}
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container-qaddumi py-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-8" />

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                مقارنة المنتجات
              </h1>
              <p className="text-gray-600">
                مقارنة بين {items.length} منتجات
              </p>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse mt-4 sm:mt-0">
              {/* Toggle Differences Only */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showOnlyDifferences}
                  onChange={(e) => setShowOnlyDifferences(e.target.checked)}
                  className="w-4 h-4 text-qaddumi-gold bg-gray-100 border-gray-300 rounded focus:ring-qaddumi-gold focus:ring-2"
                />
                <span className="mr-2 rtl:mr-0 rtl:ml-2 text-sm text-gray-700">
                  إظهار الاختلافات فقط
                </span>
              </label>

              {/* Clear All Button */}
              <button
                onClick={clearAll}
                className="flex items-center space-x-2 rtl:space-x-reverse text-red-600 hover:text-red-700 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span className="text-sm font-medium">مسح الكل</span>
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="lg" text="جاري تحميل المقارنة..." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="sticky left-0 rtl:left-auto rtl:right-0 bg-gray-50 px-6 py-4 text-right rtl:text-left w-48">
                        <span className="text-sm font-medium text-gray-900">المواصفة</span>
                      </th>
                      {items.map((product) => (
                        <th key={product.id} className="px-6 py-4 min-w-80">
                          <div className="text-center">
                            {/* Product Image */}
                            <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 rounded-lg overflow-hidden">
                              {product.media?.[0] ? (
                                <img
                                  src={getImageUrl(product.media[0].url)}
                                  alt={getProductName(product)}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Product Name */}
                            <Link
                              to={`/p/${product.slug}`}
                              className="block text-sm font-medium text-gray-900 hover:text-qaddumi-gold transition-colors mb-2"
                            >
                              {getProductName(product)}
                            </Link>

                            {/* Brand */}
                            {getBrandName(product) && (
                              <div className="text-xs text-gray-500 mb-2">
                                {getBrandName(product)}
                              </div>
                            )}

                            {/* Price */}
                            <div className="mb-3">
                              <PriceBlock
                                price={product.price}
                                salePrice={product.sale_price}
                                currency={product.currency}
                                size="sm"
                                showSavings={false}
                              />
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                              <button
                                onClick={() => handleAddToCart(product)}
                                disabled={isOutOfStock(product)}
                                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                  isOutOfStock(product)
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-qaddumi-gold hover:bg-qaddumi-gold-dark text-qaddumi-charcoal'
                                }`}
                              >
                                {import.meta.env.VITE_ENABLE_CART === 'true' ? (
                                  <>
                                    <ShoppingCartIcon className="w-4 h-4 inline mr-1 rtl:mr-0 rtl:ml-1" />
                                    {isOutOfStock(product) ? 'غير متوفر' : 'أضف للسلة'}
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 inline mr-1 rtl:mr-0 rtl:ml-1" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                    </svg>
                                    {isOutOfStock(product) ? 'غير متوفر' : 'اطلب الآن'}
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => removeItem(product.id)}
                                className="w-full py-2 px-3 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                              >
                                <XMarkIcon className="w-4 h-4 inline mr-1 rtl:mr-0 rtl:ml-1" />
                                إزالة
                              </button>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {getFilteredSpecs().map((specKey, index) => (
                      <tr key={specKey} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="sticky left-0 rtl:left-auto rtl:right-0 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-900 border-r rtl:border-r-0 rtl:border-l">
                          {getSpecName(specKey)}
                        </td>
                        {items.map((product) => (
                          <td key={product.id} className="px-6 py-4 text-sm text-gray-700 text-center">
                            {getSpecValue(product, specKey)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 text-center">
            <WhatsAppButton
              phone={import.meta.env.VITE_WHATSAPP_NUMBER}
              message=""
              className="btn-primary inline-flex items-center space-x-2 rtl:space-x-reverse"
              onClick={handleCompareAll}
            >
              <span>احصل على مقارنة مفصلة عبر واتساب</span>
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default ComparePage