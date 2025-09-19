import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { getImageUrl } from '../../lib/utils'

const HeroSlider = () => {
  const { t, i18n } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const isRTL = i18n.language === 'ar'

  // Hero slides data - this could come from an API
  const slides = [
    {
      id: 1,
      image: '/images/heroes/hero-1.jpg',
      title: {
        ar: 'أحدث الأجهزة الكهربائية بأفضل الأسعار',
        en: 'Latest Electrical Appliances at Best Prices'
      },
      subtitle: {
        ar: 'اكتشف مجموعتنا الواسعة من الأجهزة الكهربائية عالية الجودة مع ضمان شامل وخدمة ما بعد البيع المميزة',
        en: 'Discover our wide range of high-quality electrical appliances with comprehensive warranty and excellent after-sales service'
      },
      cta: {
        text: {
          ar: 'تسوق الآن',
          en: 'Shop Now'
        },
        href: '/products'
      },
      badge: {
        text: {
          ar: 'خصومات تصل إلى 30%',
          en: 'Up to 30% Off'
        },
        color: 'bg-red-500'
      }
    },
    {
      id: 2,
      image: '/images/heroes/hero-2.jpg',
      title: {
        ar: 'ثلاجات وأجهزة المطبخ الذكية',
        en: 'Smart Refrigerators & Kitchen Appliances'
      },
      subtitle: {
        ar: 'مجموعة حصرية من أحدث ثلاجات سامسونج وإل جي مع تقنيات التوفير في الطاقة',
        en: 'Exclusive collection of latest Samsung and LG refrigerators with energy-saving technologies'
      },
      cta: {
        text: {
          ar: 'اعرض الثلاجات',
          en: 'View Refrigerators'
        },
        href: '/c/refrigerators'
      },
      badge: {
        text: {
          ar: 'جديد',
          en: 'New'
        },
        color: 'bg-green-500'
      }
    },
    {
      id: 3,
      image: '/images/heroes/hero-3.jpg',
      title: {
        ar: 'توصيل وتركيب مجاني',
        en: 'Free Delivery & Installation'
      },
      subtitle: {
        ar: 'خدمة التوصيل المجاني داخل طولكرم والقرى المجاورة مع تركيب احترافي لجميع الأجهزة',
        en: 'Free delivery service in Tulkarm and surrounding villages with professional installation for all appliances'
      },
      cta: {
        text: {
          ar: 'اعرف المزيد',
          en: 'Learn More'
        },
        href: '/services'
      },
      badge: {
        text: {
          ar: 'مجاني',
          en: 'Free'
        },
        color: 'bg-blue-500'
      }
    }
  ]

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const getCurrentText = (textObj) => {
    return textObj[i18n.language] || textObj.ar
  }

  return (
    <div className="relative h-screen max-h-[600px] overflow-hidden bg-gray-900">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={getImageUrl(slide.image, '/images/placeholder-hero.jpg')}
                alt={getCurrentText(slide.title)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container-qaddumi">
                <div className="max-w-3xl">
                  {/* Badge */}
                  {slide.badge && (
                    <span className={`inline-block px-4 py-2 rounded-full text-white text-sm font-medium mb-4 ${slide.badge.color}`}>
                      {getCurrentText(slide.badge.text)}
                    </span>
                  )}

                  {/* Title */}
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    {getCurrentText(slide.title)}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                    {getCurrentText(slide.subtitle)}
                  </p>

                  {/* CTA Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse">
                    <a
                      href={slide.cta.href}
                      className="btn-primary text-lg px-8 py-4 inline-flex items-center group"
                    >
                      {getCurrentText(slide.cta.text)}
                      <svg 
                        className={`w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2 transition-transform group-hover:translate-x-1 ${isRTL ? 'rtl:group-hover:-translate-x-1' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>

                    {/* Trust Badge */}
                    <div className="flex items-center text-white text-sm">
                      <svg className="w-5 h-5 text-qaddumi-gold mr-2 rtl:mr-0 rtl:ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {t('home.hero.trustBadge')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200 group"
        aria-label={t('common.previous')}
      >
        {isRTL ? (
          <ChevronRightIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
        ) : (
          <ChevronLeftIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
        )}
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200 group"
        aria-label={t('common.next')}
      >
        {isRTL ? (
          <ChevronLeftIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
        ) : (
          <ChevronRightIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
        )}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2 rtl:space-x-reverse">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-qaddumi-gold scale-125'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 rtl:right-auto rtl:left-8 text-white text-sm bg-black bg-opacity-30 px-3 py-1 rounded-full">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  )
}

export default HeroSlider