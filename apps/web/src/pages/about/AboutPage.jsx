import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import {
  BuildingStorefrontIcon,
  UsersIcon,
  TrophyIcon,
  HeartIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'

// Components
import Breadcrumbs from '../../components/common/Breadcrumbs'
import WhatsAppButton from '../../components/common/WhatsAppButton'

// Utilities
import { generateSEO } from '../../lib/seo'

const AboutPage = () => {
  const { t } = useTranslation()

  // SEO data
  const seo = generateSEO({
    title: 'من نحن - قدومي للإلكترونيات والأجهزة الكهربائية',
    description: 'تعرف على قصة قدومي للإلكترونيات، أكثر من 20 عاماً من الخبرة في خدمة أهالي طولكرم بأجود الأجهزة الكهربائية وأفضل الخدمات',
    url: '/about'
  })

  const breadcrumbItems = [{ name: 'من نحن' }]

  const stats = [
    { icon: BuildingStorefrontIcon, number: '20+', label: 'سنة من الخبرة' },
    { icon: UsersIcon, number: '50,000+', label: 'عميل راضي' },
    { icon: TrophyIcon, number: '100+', label: 'علامة تجارية' },
    { icon: HeartIcon, number: '95%', label: 'نسبة رضا العملاء' }
  ]

  const values = [
    {
      title: 'الجودة أولاً',
      description: 'نختار بعناية أجود المنتجات من العلامات التجارية الموثوقة عالمياً',
      icon: '🏆'
    },
    {
      title: 'خدمة العملاء',
      description: 'فريقنا المدرب جاهز لخدمتك قبل وأثناء وبعد الشراء',
      icon: '🤝'
    },
    {
      title: 'الأسعار العادلة',
      description: 'نقدم أفضل الأسعار التنافسية مع إمكانية التفاوض والتقسيط',
      icon: '💰'
    },
    {
      title: 'الثقة والمصداقية',
      description: 'أكثر من 20 عاماً من الثقة المتبادلة مع عملائنا الكرام',
      icon: '🛡️'
    }
  ]

  const timeline = [
    {
      year: '2003',
      title: 'البداية',
      description: 'تأسيس المحل الأول في قلب مدينة طولكرم'
    },
    {
      year: '2008',
      title: 'التوسع',
      description: 'إضافة خدمات التوصيل والتركيب للعملاء'
    },
    {
      year: '2015',
      title: 'التطوير',
      description: 'تحديث المحل وإضافة أحدث العلامات التجارية'
    },
    {
      year: '2020',
      title: 'الرقمنة',
      description: 'إطلاق الخدمات الرقمية والتسوق الإلكتروني'
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

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-soft overflow-hidden mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12 flex items-center">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    قصتنا مع الكهربائيات
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    منذ عام 2003، نخدم أهالي طولكرم والمناطق المجاورة بأجود الأجهزة الكهربائية 
                    وأفضل الخدمات. رحلة امتدت لأكثر من 20 عاماً من الثقة والجودة والتميز.
                  </p>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <WhatsAppButton
                      phone={import.meta.env.VITE_WHATSAPP_NUMBER}
                      message="مرحبا، أريد معرفة المزيد عن محل قدومي"
                      className="btn-primary inline-flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <span>تواصل معنا</span>
                    </WhatsAppButton>
                    <a
                      href="#contact"
                      className="text-qaddumi-gold hover:text-qaddumi-gold-dark font-medium"
                    >
                      معلومات التواصل
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-qaddumi flex items-center justify-center p-8 lg:p-12">
                <div className="text-center text-qaddumi-charcoal">
                  <BuildingStorefrontIcon className="w-24 h-24 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">متجر قدومي</h3>
                  <p className="text-lg opacity-80">وجهتك الموثوقة للأجهزة الكهربائية</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-soft p-6 text-center">
                <div className="w-12 h-12 bg-qaddumi-gold bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-qaddumi-gold" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              قيمنا ومبادئنا
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-lg shadow-soft p-6">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="text-4xl flex-shrink-0">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              رحلتنا عبر السنوات
            </h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-qaddumi-gold"></div>
              
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 rtl:pr-0 rtl:pl-8 text-right rtl:text-left' : 'pl-8 rtl:pl-0 rtl:pr-8 text-left rtl:text-right'}`}>
                      <div className="bg-white rounded-lg shadow-soft p-6">
                        <div className="text-2xl font-bold text-qaddumi-gold mb-2">
                          {item.year}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-qaddumi-gold rounded-full border-4 border-white"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-lg shadow-soft p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                فريقنا المتخصص
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                فريق من الخبراء والمتخصصين في مجال الأجهزة الكهربائية، 
                مدربون على أعلى المستويات لخدمتك بأفضل شكل ممكن
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-qaddumi-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-12 h-12 text-qaddumi-gold" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  فريق المبيعات
                </h3>
                <p className="text-gray-600 text-sm">
                  خبراء في المنتجات لمساعدتك في اختيار الأنسب لاحتياجاتك
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 bg-qaddumi-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BuildingStorefrontIcon className="w-12 h-12 text-qaddumi-gold" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  فريق التركيب
                </h3>
                <p className="text-gray-600 text-sm">
                  فنيون مدربون لتركيب وتشغيل جميع أنواع الأجهزة الكهربائية
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 bg-qaddumi-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartIcon className="w-12 h-12 text-qaddumi-gold" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  خدمة العملاء
                </h3>
                <p className="text-gray-600 text-sm">
                  فريق متخصص في خدمة العملاء ومتابعة ما بعد البيع
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div id="contact" className="bg-gradient-qaddumi rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-qaddumi-charcoal mb-4">
                معلومات التواصل
              </h2>
              <p className="text-qaddumi-charcoal opacity-80 text-lg">
                نحن هنا لخدمتك في أي وقت
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-qaddumi-charcoal bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="w-8 h-8 text-qaddumi-charcoal" />
                </div>
                <h3 className="font-semibold text-qaddumi-charcoal mb-2">العنوان</h3>
                <p className="text-qaddumi-charcoal opacity-80 text-sm">
                  {t('store.address')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-qaddumi-charcoal bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PhoneIcon className="w-8 h-8 text-qaddumi-charcoal" />
                </div>
                <h3 className="font-semibold text-qaddumi-charcoal mb-2">الهاتف</h3>
                <p className="text-qaddumi-charcoal opacity-80 text-sm" dir="ltr">
                  {t('store.phone')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-qaddumi-charcoal bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="w-8 h-8 text-qaddumi-charcoal" />
                </div>
                <h3 className="font-semibold text-qaddumi-charcoal mb-2">ساعات العمل</h3>
                <p className="text-qaddumi-charcoal opacity-80 text-sm">
                  {t('store.hours')}
                  <br />
                  {t('store.fridayHours')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-qaddumi-charcoal bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <EnvelopeIcon className="w-8 h-8 text-qaddumi-charcoal" />
                </div>
                <h3 className="font-semibold text-qaddumi-charcoal mb-2">البريد الإلكتروني</h3>
                <p className="text-qaddumi-charcoal opacity-80 text-sm">
                  {t('store.email')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
