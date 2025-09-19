import { useTranslation } from 'react-i18next'
import {
  TruckIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

const ServicesBanner = () => {
  const { t } = useTranslation()

  const services = [
    {
      icon: TruckIcon,
      title: t('services.freeDelivery'),
      description: 'توصيل مجاني داخل طولكرم والقرى المجاورة',
      color: 'text-blue-600'
    },
    {
      icon: WrenchScrewdriverIcon,
      title: t('services.professionalInstallation'),
      description: 'تركيب احترافي بواسطة فنيين متخصصين',
      color: 'text-green-600'
    },
    {
      icon: ShieldCheckIcon,
      title: t('services.reliableWarranty'),
      description: 'ضمان شامل على جميع المنتجات',
      color: 'text-purple-600'
    },
    {
      icon: ArrowPathIcon,
      title: t('services.oldApplianceRemoval'),
      description: 'سحب وتخلص آمن من الجهاز القديم',
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="container-qaddumi">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-qaddumi-charcoal mb-4">
          {t('home.sections.ourServices')}
        </h2>
        <p className="text-qaddumi-charcoal text-lg max-w-2xl mx-auto">
          نقدم خدمات شاملة لضمان راحتك وسعادتك مع منتجاتنا
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="text-center group animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <service.icon className={`w-8 h-8 ${service.color}`} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-qaddumi-charcoal mb-2 group-hover:text-qaddumi-gold transition-colors">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-qaddumi-charcoal opacity-80 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <a
          href="/services"
          className="inline-flex items-center bg-white hover:bg-gray-50 text-qaddumi-charcoal font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          اعرف المزيد عن خدماتنا
          <svg className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default ServicesBanner