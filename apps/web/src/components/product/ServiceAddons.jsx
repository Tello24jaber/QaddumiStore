import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  TruckIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { servicesAPI } from '../../lib/api'
import { formatPrice } from '../../lib/utils'
import LoadingSpinner from '../common/LoadingSpinner'
import PropTypes from 'prop-types'

const ServiceAddons = ({ 
  productId, 
  categoryId, 
  selectedServices = [], 
  onServiceChange,
  className = '' 
}) => {
  const { t, i18n } = useTranslation()
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        const data = await servicesAPI.getAll(i18n.language)
        
        // Filter services that apply to this category
        const applicableServices = data.filter(service => {
          if (!service.applies_to_categories || service.applies_to_categories.length === 0) {
            return true // Service applies to all categories
          }
          return service.applies_to_categories.includes(categoryId)
        })
        
        setServices(applicableServices)
        setError(null)
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Failed to load services')
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [i18n.language, categoryId])

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

  const handleServiceToggle = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id)
    let updatedServices

    if (isSelected) {
      updatedServices = selectedServices.filter(s => s.id !== service.id)
    } else {
      updatedServices = [...selectedServices, service]
    }

    onServiceChange?.(updatedServices)
  }

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0)
  }

  if (isLoading) {
    return <LoadingSpinner size="md" text="جاري تحميل الخدمات..." />
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        <p>حدث خطأ في تحميل الخدمات</p>
      </div>
    )
  }

  if (services.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        الخدمات الإضافية
      </h3>

      <div className="space-y-3">
        {services.map((service) => {
          const IconComponent = getServiceIcon(service.code)
          const isSelected = selectedServices.some(s => s.id === service.id)
          
          return (
            <div
              key={service.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-qaddumi-gold bg-qaddumi-gold bg-opacity-5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleServiceToggle(service)}
            >
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                {/* Checkbox */}
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleServiceToggle(service)}
                    className="w-4 h-4 text-qaddumi-gold bg-gray-100 border-gray-300 rounded focus:ring-qaddumi-gold focus:ring-2"
                  />
                </div>

                {/* Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-qaddumi-gold text-qaddumi-charcoal' : 'bg-gray-100 text-gray-600'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Service Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      isSelected ? 'text-qaddumi-gold' : 'text-gray-900'
                    }`}>
                      {getServiceName(service)}
                    </h4>
                    <span className={`font-semibold ${
                      isSelected ? 'text-qaddumi-gold' : 'text-gray-900'
                    }`}>
                      {service.price > 0 
                        ? formatPrice(service.price, 'ILS', i18n.language)
                        : 'مجاني'
                      }
                    </span>
                  </div>
                  {getServiceDescription(service) && (
                    <p className="text-sm text-gray-600 mt-1">
                      {getServiceDescription(service)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      {selectedServices.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">
              إجمالي الخدمات الإضافية:
            </span>
            <span className="text-xl font-bold text-qaddumi-gold">
              {formatPrice(calculateTotal(), 'ILS', i18n.language)}
            </span>
          </div>
        </div>
      )}

      {/* Service Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          💡 <strong>ملاحظة:</strong> يمكنك إضافة هذه الخدمات أثناء الطلب أو الاتصال بنا لاحقاً لترتيبها.
        </p>
      </div>
    </div>
  )
}

ServiceAddons.propTypes = {
  productId: PropTypes.string.isRequired,
  categoryId: PropTypes.string,
  selectedServices: PropTypes.array,
  onServiceChange: PropTypes.func,
  className: PropTypes.string,
}

export default ServiceAddons