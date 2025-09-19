import { useTranslation } from 'react-i18next'
import { ScaleIcon } from '@heroicons/react/24/outline'
import { useCompareStore } from '../../store/compareStore'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'

const CompareButton = ({ product, className = '', size = 'md' }) => {
  const { t } = useTranslation()
  const { addItem, removeItem, isInCompare } = useCompareStore()

  const isInCompareList = isInCompare(product.id)

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = () => {
    if (isInCompareList) {
      removeItem(product.id)
      toast.success('تم إزالة المنتج من المقارنة')
    } else {
      const result = addItem(product)
      if (result.success) {
        toast.success('تم إضافة المنتج للمقارنة')
      } else {
        toast.error(result.message)
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center space-x-2 rtl:space-x-reverse
        font-medium rounded-lg transition-all duration-200
        ${isInCompareList
          ? 'bg-qaddumi-gold text-qaddumi-charcoal hover:bg-qaddumi-gold-dark'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-qaddumi-gold'
        }
        ${sizeClasses[size]} ${className}
      `}
    >
      <ScaleIcon className={iconSizes[size]} />
      <span>
        {isInCompareList ? 'إزالة من المقارنة' : 'أضف للمقارنة'}
      </span>
    </button>
  )
}

CompareButton.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
}

export default CompareButton