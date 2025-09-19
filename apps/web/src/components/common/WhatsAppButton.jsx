import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'
import { generateWhatsAppUrl } from '../../lib/utils'
import { useTranslation } from 'react-i18next'

const WhatsAppButton = ({ 
  phone, 
  message = '', 
  className = '', 
  size = 'md',
  showText = true,
  children 
}) => {
  const { t, i18n } = useTranslation()
  
  const defaultMessage = message || t('store.whatsappDefault', 'مرحبا، أريد الاستفسار عن المنتجات')
  const whatsappUrl = generateWhatsAppUrl(phone, defaultMessage, i18n.language)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center space-x-2 rtl:space-x-reverse text-green-600 hover:text-green-700 transition-colors ${className}`}
    >
      <ChatBubbleLeftEllipsisIcon className={sizeClasses[size]} />
      {showText && (
        <span className="text-sm font-medium">
          {children || 'WhatsApp'}
        </span>
      )}
    </a>
  )
}

export default WhatsAppButton