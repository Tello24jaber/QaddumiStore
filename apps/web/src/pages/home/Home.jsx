import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

// Components
import HeroSlider from '../../components/home/HeroSlider'
import FeaturedCategories from '../../components/home/FeaturedCategories'
import BestSellers from '../../components/home/BestSellers'
import NewArrivals from '../../components/home/NewArrivals'
import ServicesBanner from '../../components/home/ServicesBanner'
import ShopByBrand from '../../components/home/ShopByBrand'
import WhyChooseUs from '../../components/home/WhyChooseUs'
import NewsletterSignup from '../../components/home/NewsletterSignup'

// Utils
import { useSEO } from '../../lib/seo'
import { generateOrganizationStructuredData } from '../../lib/seo'

const Home = () => {
  const { t, i18n } = useTranslation()
  const { generateSEO, siteConfig } = useSEO()

  // Generate SEO data
  const seo = generateSEO({
    title: siteConfig.name[i18n.language],
    description: siteConfig.description[i18n.language],
    url: '/',
    type: 'website',
  })

  // Generate structured data
  const organizationData = generateOrganizationStructuredData(i18n.language)

  useEffect(() => {
    // Track page view for analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_title: seo.title,
        page_location: window.location.href,
      })
    }
  }, [seo.title])

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        {seo.meta.map((meta, index) => (
          <meta key={index} {...meta} />
        ))}
        {seo.link.map((link, index) => (
          <link key={index} {...link} />
        ))}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationData)}
        </script>
      </Helmet>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative">
          <HeroSlider />
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container-qaddumi">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('home.sections.featuredCategories')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                اكتشف مجموعتنا المتنوعة من الأجهزة الكهربائية عالية الجودة
              </p>
            </div>
            <FeaturedCategories />
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-16">
          <div className="container-qaddumi">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('home.sections.bestSellers')}
                </h2>
                <p className="text-gray-600">
                  المنتجات الأكثر مبيعاً وثقة من عملائنا
                </p>
              </div>
              <a 
                href="/products?sort=popularity"
                className="text-qaddumi-gold hover:text-qaddumi-gold-dark font-medium"
              >
                {t('common.viewAll')}
              </a>
            </div>
            <BestSellers />
          </div>
        </section>

        {/* Services Banner */}
        <section className="py-16 bg-gradient-qaddumi">
          <ServicesBanner />
        </section>

        {/* New Arrivals */}
        <section className="py-16 bg-gray-50">
          <div className="container-qaddumi">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('home.sections.newArrivals')}
                </h2>
                <p className="text-gray-600">
                  أحدث المنتجات المضافة إلى متجرنا
                </p>
              </div>
              <a 
                href="/products?sort=newest"
                className="text-qaddumi-gold hover:text-qaddumi-gold-dark font-medium"
              >
                {t('common.viewAll')}
              </a>
            </div>
            <NewArrivals />
          </div>
        </section>

        {/* Shop by Brand */}
        <section className="py-16">
          <div className="container-qaddumi">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('home.sections.shopByBrand')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                تسوق من العلامات التجارية المفضلة لديك والموثوقة عالمياً
              </p>
            </div>
            <ShopByBrand />
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="container-qaddumi">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('home.sections.whyChooseUs')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('store.experience')} - وجهتك الموثوقة للأجهزة الكهربائية في فلسطين
              </p>
            </div>
            <WhyChooseUs />
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-qaddumi-charcoal">
          <NewsletterSignup />
        </section>

        {/* Store Location & Hours */}
        <section className="py-16">
          <div className="container-qaddumi">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Store Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  زورونا في متجرنا
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <svg className="w-6 h-6 text-qaddumi-gold mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">العنوان</h3>
                      <p className="text-gray-600">{t('store.address')}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <svg className="w-6 h-6 text-qaddumi-gold mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">ساعات العمل</h3>
                      <p className="text-gray-600">{t('store.hours')}</p>
                      <p className="text-gray-600">{t('store.fridayHours')}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <svg className="w-6 h-6 text-qaddumi-gold mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">اتصل بنا</h3>
                      <p className="text-gray-600" dir="ltr">{t('store.phone')}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href="/contact"
                    className="btn-primary inline-flex items-center"
                  >
                    احصل على الاتجاهات
                    <svg className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-600">
                    خريطة الموقع
                    <br />
                    <small>يمكن دمج خرائط جوجل هنا</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home