import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getImageUrl } from '../../lib/utils'
import PropTypes from 'prop-types'

const CategoryCard = ({ 
  category, 
  showProductCount = true, 
  variant = 'default',
  className = '' 
}) => {
  const { i18n } = useTranslation()

  const getCategoryName = () => {
    return i18n.language === 'ar' ? category.name_ar : category.name_en
  }

  const getCategoryDescription = () => {
    return i18n.language === 'ar' ? category.description_ar : category.description_en
  }

  const variants = {
    default: 'bg-white rounded-lg shadow-soft hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-1',
    minimal: 'bg-white rounded-lg border border-gray-200 hover:border-qaddumi-gold transition-all duration-300',
    featured: 'bg-gradient-to-br from-qaddumi-gold to-qaddumi-gold-dark text-qaddumi-charcoal rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
  }

  return (
    <Link
      to={`/c/${category.slug}`}
      className={`block group ${variants[variant]} ${className}`}
    >
      <div className="p-6">
        {/* Category Image/Icon */}
        <div className="mb-4">
          {category.image_url ? (
            <div className="aspect-square w-16 h-16 mx-auto rounded-lg overflow-hidden bg-gray-100">
              <img
                src={getImageUrl(category.image_url)}
                alt={getCategoryName()}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : category.icon ? (
            <div className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center text-3xl ${
              variant === 'featured' 
                ? 'bg-qaddumi-charcoal bg-opacity-10' 
                : 'bg-gray-100 group-hover:bg-qaddumi-gold group-hover:bg-opacity-10'
            } transition-colors duration-300`}>
              {category.icon}
            </div>
          ) : (
            <div className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center ${
              variant === 'featured' 
                ? 'bg-qaddumi-charcoal bg-opacity-10' 
                : 'bg-gray-100 group-hover:bg-qaddumi-gold group-hover:bg-opacity-10'
            } transition-colors duration-300`}>
              <svg className={`w-8 h-8 ${
                variant === 'featured' 
                  ? 'text-qaddumi-charcoal' 
                  : 'text-gray-400 group-hover:text-qaddumi-gold'
              } transition-colors duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          )}
        </div>

        {/* Category Name */}
        <h3 className={`text-lg font-semibold text-center mb-2 ${
          variant === 'featured' 
            ? 'text-qaddumi-charcoal' 
            : 'text-gray-900 group-hover:text-qaddumi-gold'
        } transition-colors duration-300`}>
          {getCategoryName()}
        </h3>

        {/* Category Description */}
        {getCategoryDescription() && (
          <p className={`text-sm text-center mb-3 line-clamp-2 ${
            variant === 'featured' 
              ? 'text-qaddumi-charcoal opacity-80' 
              : 'text-gray-600'
          }`}>
            {getCategoryDescription()}
          </p>
        )}

        {/* Product Count */}
        {showProductCount && category.product_count !== undefined && (
          <div className="text-center">
            <span className={`text-sm font-medium ${
              variant === 'featured' 
                ? 'text-qaddumi-charcoal opacity-70' 
                : 'text-gray-500'
            }`}>
              {category.product_count} منتج
            </span>
          </div>
        )}

        {/* Hover Arrow */}
        <div className={`mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          <svg className={`w-5 h-5 mx-auto ${
            variant === 'featured' ? 'text-qaddumi-charcoal' : 'text-qaddumi-gold'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

CategoryCard.propTypes = {
  category: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name_ar: PropTypes.string.isRequired,
    name_en: PropTypes.string.isRequired,
    description_ar: PropTypes.string,
    description_en: PropTypes.string,
    image_url: PropTypes.string,
    icon: PropTypes.string,
    product_count: PropTypes.number,
  }).isRequired,
  showProductCount: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'minimal', 'featured']),
  className: PropTypes.string,
}

export default CategoryCard