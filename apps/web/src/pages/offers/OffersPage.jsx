import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import {
  ClockIcon,
  TagIcon,
  SparklesIcon,
  GiftIcon,
} from '@heroicons/react/24/outline'

// Components
import ProductCard from '../../components/product/ProductCard'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'

// API and utilities
import { productsAPI } from '../../lib/api'
import { formatPrice } from '../../lib/utils'
import { generateSEO } from '../../lib/seo'

const OffersPage = () => {
  const { t, i18n } = useTranslation()
  const [products, setProducts] = useState([])
  const [activeOffers, setActiveOffers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true)
        
        // Fetch products on sale
        const productsData = await productsAPI.getAll({
          locale: i18n.language,
          onSale: true,
          pageSize: 50
        })
        
        setProducts(productsData.data || productsData)

        // Mock active offers data - in real app, this would come from API
        const mockOffers = [
          {
            id: 1,
            title_ar: 'عرض الثلاجات الكبيرة',
            title_en: 'Large Refrigerators Sale',
            description_ar: 'خصم 15% على جميع الثلاجات أكبر من 16 قدم',
            description_en: '15% off all refrigerators larger than 16 cu.ft',
            discount_percentage: 15,
            ends_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
            badge_color: '#EF4444',
            image: '/images/offers/refrigerators-sale.jpg'
          },
          {
            id: 2,
            title_ar: 'عرض المكيفات الصيفي',
            title_en: 'Summer AC Sale',
            description_ar: 'خصم يصل إلى 20% على جميع المكيفات مع تركيب مجاني',
            description_en: 'Up to 20% off all AC units with free installation',
            discount_percentage: 20,
            ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            badge_color: '#10B981',
            image: '/images/offers/ac-sale.jpg'
          },
          {
            id: 3,
            title_ar: 'باقة الأجهزة الصغيرة',
            title_en: 'Small Appliances Bundle',
            description_ar: 'اشتر 3 أجهزة صغيرة واحصل على خصم 25%',
            description_en: 'Buy 3 small appliances and get 25% discount',
            discount_percentage: 25,
            ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            badge_color: '#F59E0B',
            image: '/images/offers/small-appliances-bundle.jpg'
          }
        ]
        
        setActiveOffers(mockOffers)
      } catch (error) {
        console.error('Error fetching offers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOffers()
  }, [i18n.language])

  const getOfferTitle = (offer) => {
    return i18n.language === 'ar' ? offer.title_ar : offer.title_en
  }

  const getOfferDescription = (offer) => {
    return i18n.language === 'ar' ? offer.description_ar : offer.description_en
  }

  const formatTimeRemaining = (endDate) => {
    const now = new Date()
    const diff = endDate - now
    
    if (diff <= 0) return 'انتهى العرض'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) {
      return `${days} يوم و ${hours} ساعة متبقية`
    } else if (hours > 0) {
      return `${hours} ساعة متبقية`
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `${minutes} دقيقة متبقية`
    }
  }

  // SEO data
  const seo = generateSEO({
    title: 'العروض والخصومات - قدومي للإلكترونيات',
    description: 'اكتشف أحدث العروض والخصومات على الأجهزة الكهربائية. وفر على مشترياتك مع عروض حصرية وخصومات تصل إلى 50%',
    url: '/offers'
  })

  const breadcrumbItems = [{ name: 'العروض والخصومات' }]

  const offerTypes = [
    {
      icon: TagIcon,
      title: 'خصومات فورية',
      description: 'خصومات مباشرة على الأسعار تصل إلى 50%',
      color: 'text-red-600'
    },
    {
      icon: GiftIcon,
      title: 'هدايا مجانية',
      description: 'اكسسوارات وهدايا مجانية مع مشترياتك',
      color: 'text-green-600'
    },
    {
      icon: SparklesIcon,
      title: 'عروض باقات',
      description: 'اشتر أكثر ووفر أكثر مع عروض الباقات',
      color: 'text-purple-600'
    },
    {
      icon: ClockIcon,
      title: 'عروض موسمية',
      description: 'عروض خاصة للمواسم والمناسبات',
      color: 'text-blue-600'
    }
  ]

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
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              العروض والخصومات الحصرية
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              لا تفوت الفرصة! اكتشف أحدث العروض والخصومات على أجود الأجهزة الكهربائية
            </p>
          </div>

          {/* Offer Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {offerTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-soft hover:shadow-soft-lg transition-shadow">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <type.icon className={`w-6 h-6 ${type.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {type.description}
                </p>
              </div>
            ))}
          </div>

          {/* Active Offers */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" text="جاري تحميل العروض..." />
            </div>
          ) : (
            <>
              {activeOffers.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    العروض النشطة
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {activeOffers.map((offer) => (
                      <div 
                        key={offer.id}
                        className="bg-white rounded-lg shadow-soft hover:shadow-soft-lg transition-shadow overflow-hidden"
                      >
                        <div className="relative">
                          <div 
                            className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                            style={{ backgroundColor: offer.badge_color + '20' }}
                          >
                            <div className="text-center">
                              <div className="text-4xl font-bold mb-2" style={{ color: offer.badge_color }}>
                                {offer.discount_percentage}%
                              </div>
                              <div className="text-lg font-semibold text-gray-700">خصم</div>
                            </div>
                          </div>
                          <div 
                            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 px-3 py-1 rounded-full text-white text-sm font-medium"
                            style={{ backgroundColor: offer.badge_color }}
                          >
                            عرض محدود
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {getOfferTitle(offer)}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {getOfferDescription(offer)}
                          </p>
                          
                          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                            <ClockIcon className="w-5 h-5 text-orange-500" />
                            <span className="text-sm text-orange-600 font-medium">
                              {formatTimeRemaining(offer.ends_at)}
                            </span>
                          </div>

                          <button className="w-full bg-qaddumi-gold hover:bg-qaddumi-gold-dark text-qaddumi-charcoal font-semibold py-3 rounded-lg transition-colors">
                            استكشف العرض
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products on Sale */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  المنتجات المخفضة
                </h2>
                
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        showBadge={true}
                        badgeText="عرض خاص"
                        badgeColor="bg-red-500"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    type="products"
                    title="لا توجد عروض حالياً"
                    description="تابعنا للحصول على أحدث العروض والخصومات"
                    actionText="تصفح المنتجات"
                    actionHref="/products"
                  />
                )}
              </div>
            </>
          )}

          {/* Newsletter Signup for Offers */}
          <div className="mt-16 bg-gradient-qaddumi rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-qaddumi-charcoal mb-4">
              لا تفوت أي عرض!
            </h2>
            <p className="text-lg text-qaddumi-charcoal opacity-80 mb-6">
              اشترك في قائمتنا البريدية لتصلك أحدث العروض والخصومات فور إطلاقها
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="عنوان البريد الإلكتروني"
                  className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500"
                />
                <button className="px-6 py-3 bg-qaddumi-charcoal hover:bg-gray-800 text-qaddumi-gold font-semibold rounded-lg transition-colors">
                  اشتراك
                </button>
              </div>
            </div>
            
            <p className="text-xs text-qaddumi-charcoal opacity-60 mt-4">
              سنرسل لك رسالة واحدة أسبوعياً فقط بأفضل العروض
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default OffersPage