import { 
  ShoppingBagIcon, 
  MagnifyingGlassIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'

const EmptyState = ({ 
  type = 'general',
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = '' 
}) => {
  const typeConfig = {
    general: {
      icon: ExclamationCircleIcon,
      defaultTitle: 'لا توجد عناصر',
      defaultDescription: 'لا توجد عناصر لعرضها في الوقت الحالي'
    },
    products: {
      icon: ShoppingBagIcon,
      defaultTitle: 'لا توجد منتجات',
      defaultDescription: 'لم نعثر على أي منتجات تطابق معايير البحث'
    },
    search: {
      icon: MagnifyingGlassIcon,
      defaultTitle: 'لا توجد نتائج بحث',
      defaultDescription: 'جرب البحث بكلمات مفتاحية مختلفة'
    }
  }

  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <div className={`text-center py-12 ${className}`}>
      <IconComponent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description || config.defaultDescription}
      </p>
      {(actionText && (actionHref || onAction)) && (
        <>
          {actionHref ? (
            <a
              href={actionHref}
              className="btn-primary inline-flex items-center"
            >
              {actionText}
            </a>
          ) : (
            <button
              onClick={onAction}
              className="btn-primary"
            >
              {actionText}
            </button>
          )}
        </>
      )}
    </div>
  )
}

EmptyState.propTypes = {
  type: PropTypes.oneOf(['general', 'products', 'search']),
  title: PropTypes.string,
  description: PropTypes.string,
  actionText: PropTypes.string,
  actionHref: PropTypes.string,
  onAction: PropTypes.func,
  className: PropTypes.string,
}

export default EmptyState