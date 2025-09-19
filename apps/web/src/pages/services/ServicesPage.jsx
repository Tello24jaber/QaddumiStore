import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import {
  TruckIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

// Components
import Breadcrumbs from '../../components/common/Breadcrumbs'
import WhatsAppButton from '../../components/common/WhatsAppButton'
import LoadingSpinner from '../../components/common/LoadingSpinner'

// API and utilities
import { servicesAPI } from '../../lib/api'
import { formatPrice } from '../../lib/utils'
import { generateSEO } from '../../lib/seo'

const ServicesPage = () => {
  const { t, i18n } = useTranslation()
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesAPI.getAll(i18n.language)
        setServices(data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [i18n.language])

  const getServiceName = (service) => {
    return i18n.language === 'ar' ? service.name_ar : service.name_en
  }

  const getServiceDescription = (service) => {
    return i18n.language === 'ar' ? service.description_ar : service.description_en
  }

  const getServiceIcon = (serviceCode) => {
    const iconMap = {
      delivery: TruckIcon,
      installation: WrenchScrewdriverIcon,
      extended_warranty: ShieldCheckIcon,
      haul_away: ArrowPathIcon,
    }
    return iconMap[serviceCode] || WrenchScrewdriverIcon
  }

  // SEO data
  const seo = generateSEO({
    title: 'خدماتنا - قدومي للإلكترونيات',
    description: 'خدمات متكاملة للأجهزة الكهربائية: التوصيل والتركيب والصيانة والضمان في طولكرم وضواحيها',
    url: '/services'
  })

  const breadcrumbItems = [{ name: 'خدماتنا' }]

  const serviceFeatures = [
    {
      icon: ClockIcon,
      title: 'خدمة سريعة',
      description: 'نقدم خدماتنا في الوقت المحدد دون تأخير'
    },
    {
      icon: CheckCircleIcon,
      title: 'جودة مضمونة',
      description: 'فريق من الفنيين المهرة والمدربين'
    },
    {
      icon: PhoneIcon,
      title: 'دعم مستمر',
      description: 'خدمة عملاء متاحة للاستفسارات والدعم'
    },
    {
      icon: MapPinIcon,
      title: 'تغطية واسعة',
      description: 'نخدم طولكرم والقرى والمناطق المجاورة'
    }
  ]

  const deliveryZones = [
    { name: 'طولكرم المدينة', price: 0, time: 'نفس اليوم' },
    { name: 'ضاحية ذكر', price: 25, time: 'نفس اليوم' },
    { name: 'عتيل', price: 30, time: '24 ساعة' },
    { name: 'قفين', price: 35, time: '24 ساعة' },
    { name: 'بلعا', price: 40, time: '48 ساعة' },
    { name: 'دير الغصون', price: 45, time: '48 ساعة' }
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
              خدماتنا المتكاملة
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نقدم لك خدمات شاملة ومتكاملة للأجهزة الكهربائية من التوصيل والتركيب إلى الصيانة والدعم الفني
            </p>
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {serviceFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-qaddumi-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-qaddumi-charcoal" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Main Services */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              خدماتنا الأساسية
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => {
                  const IconComponent = getServiceIcon(service.code)
                  return (
                    <div key={service.id} className="bg-white rounded-lg shadow-soft p-8 hover:shadow-soft-lg transition-shadow">
                      <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-qaddumi-gold bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-qaddumi-gold" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {getServiceName(service)}
                            </h3>
                            <span className="text-2xl font-bold text-qaddumi-gold">
                              {service.price > 0 
                                ? formatPrice(service.price, 'ILS', i18n.language)
                                : 'مجاني'
                              }
                            </span>
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-4">
                            {getServiceDescription(service)}
                          </p>
                          <WhatsAppButton
                            phone={import.meta.env.VITE_WHATSAPP_NUMBER}
                            message={`مرحبا، أريد الاستفسار عن خدمة ${getServiceName(service)}`}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            اطلب الخدمة الآن
                          </WhatsAppButton>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Delivery Zones */}
          <div className="bg-white rounded-lg shadow-soft p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              مناطق التوصيل والأسعار
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryZones.map((zone, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{zone.name}</h4>
                    <p className="text-sm text-gray-600">{zone.time}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-qaddumi-gold">
                      {zone.price === 0 ? 'مجاني' : `${zone.price} ش`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                💡 <strong>ملاحظة:</strong> أسعار التوصيل قابلة للتعديل حسب نوع وحجم الجهاز. يرجى التواصل معنا للحصول على عرض سعر دقيق.
              </p>
            </div>
          </div>

          {/* Service Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              كيف نعمل؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'اتصل بنا',
                  description: 'تواصل معنا عبر الهاتف أو واتساب لحجز الخدمة'
                },
                {
                  step: '2',
                  title: 'تحديد الموعد',
                  description: 'نحدد معك الموعد المناسب لتقديم الخدمة'
                },
                {
                  step: '3',
                  title: 'تنفيذ الخدمة',
                  description: 'فريقنا المختص ينفذ الخدمة بأعلى معايير الجودة'
                },
                {
                  step: '4',
                  title: 'متابعة ما بعد الخدمة',
                  description: 'نتابع معك لضمان رضاك التام عن الخدمة المقدمة'
                }
              ].map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-qaddumi-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-qaddumi-charcoal">
                      {process.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {process.title}
                  </h3>
                  <p className="text-gray-600">
                    {process.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-qaddumi rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-qaddumi-charcoal mb-4">
              هل تحتاج لخدمة معينة؟
            </h2>
            <p className="text-lg text-qaddumi-charcoal opacity-80 mb-6">
              فريقنا جاهز لخدمتك وتلبية احتياجاتك في أي وقت
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse">
              <WhatsAppButton
                phone={import.meta.env.VITE_WHATSAPP_NUMBER}
                message="مرحبا، أريد الاستفسار عن خدماتكم"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2 rtl:space-x-reverse"
              >
                <span>تواصل عبر واتساب</span>
              </WhatsAppButton>
              
              <a
                href={`tel:${import.meta.env.VITE_STORE_PHONE}`}
                className="bg-qaddumi-charcoal hover:bg-gray-800 text-qaddumi-gold px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2 rtl:space-x-reverse"
              >
                <PhoneIcon className="w-5 h-5" />
                <span>اتصل بنا مباشرة</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ServicesPage