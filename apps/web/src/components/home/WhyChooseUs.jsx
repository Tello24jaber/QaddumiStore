import { useTranslation } from 'react-i18next'
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

const WhyChooseUs = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: CurrencyDollarIcon,
      title: t('home.features.competitivePrices'),
      description: 'أسعار منافسة ومعقولة مع إمكانية التفاوض والدفع بالتقسيط',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: ShieldCheckIcon,
      title: t('home.features.qualityProducts'),
      description: 'منتجات أصلية عالية الجودة من العلامات التجارية المعتمدة',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: TruckIcon,
      title: t('home.features.fastDelivery'),
      description: 'خدمة توصيل سريعة وآمنة لجميع أنحاء طولكرم والمناطق المجاورة',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: UserGroupIcon,
      title: t('home.features.excellentService'),
      description: 'فريق عمل مدرب ومتخصص لتقديم أفضل خدمة عملاء',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: ClockIcon,
      title: t('home.features.professionalInstallation'),
      description: 'خدمة تركيب احترافية بواسطة فنيين معتمدين ومدربين',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: StarIcon,
      title: t('home.features.reliableWarranty'),
      description: 'ضمان شامل على المنتجات مع خدمة ما بعد البيع المميزة',
      color: 'bg-yellow-100 text-yellow-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group animate-fade-in"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="bg-white rounded-lg p-8 hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 h-full">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-6 h-6" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-qaddumi-gold transition-colors">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WhyChooseUs