import { useTranslation } from 'react-i18next'
import { formatPrice } from '../../lib/utils'
import PropTypes from 'prop-types'

const PriceBlock = ({ 
  price, 
  salePrice, 
  currency = 'ILS', 
  className = '',
  showSavings = true,
  size = 'lg'
}) => {
  const { i18n } = useTranslation()

  const currentPrice = salePrice || price
  const originalPrice = salePrice ? price : null
  const savings = originalPrice ? originalPrice - currentPrice : 0
  const savingsPercentage = originalPrice ? Math.round((savings / originalPrice) * 100) : 0

  const sizeClasses = {
    sm: {
      current: 'text-lg',
      original: 'text-sm',
      savings: 'text-xs'
    },
    md: {
      current: 'text-xl',
      original: 'text-base',
      savings: 'text-sm'
    },
    lg: {
      current: 'text-3xl',
      original: 'text-xl',
      savings: 'text-base'
    },
    xl: {
      current: 'text-4xl',
      original: 'text-2xl',
      savings: 'text-lg'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Price Display */}
      <div className="flex items-baseline space-x-3 rtl:space-x-reverse">
        {/* Current Price */}
        <span className={`font-bold text-qaddumi-gold ${classes.current}`}>
          {formatPrice(currentPrice, currency, i18n.language)}
        </span>

        {/* Original Price (if on sale) */}
        {originalPrice && (
          <span className={`font-medium text-gray-500 line-through ${classes.original}`}>
            {formatPrice(originalPrice, currency, i18n.language)}
          </span>
        )}

        {/* Discount Percentage */}
        {savingsPercentage > 0 && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
            -{savingsPercentage}%
          </span>
        )}
      </div>

      {/* Savings Information */}
      {showSavings && savings > 0 && (
        <div className={`text-green-600 font-medium ${classes.savings}`}>
          وفر {formatPrice(savings, currency, i18n.language)}
        </div>
      )}

      {/* Price Notes */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>* الأسعار شاملة ضريبة القيمة المضافة</p>
        {salePrice && (
          <p>* العرض ساري لفترة محدودة</p>
        )}
      </div>
    </div>
  )
}

PriceBlock.propTypes = {
  price: PropTypes.number.isRequired,
  salePrice: PropTypes.number,
  currency: PropTypes.string,
  className: PropTypes.string,
  showSavings: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
}

export default PriceBlock
