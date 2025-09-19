import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'

const Breadcrumbs = ({ items = [], className = '' }) => {
  const { t } = useTranslation()

  const allItems = [
    { name: t('nav.home'), href: '/', icon: HomeIcon },
    ...items
  ]

  if (allItems.length <= 1) return null

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 rtl:space-x-reverse">
        {allItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon 
                className="w-4 h-4 text-gray-400 mx-2 rtl:rotate-180" 
                aria-hidden="true" 
              />
            )}
            {index === allItems.length - 1 ? (
              <span className="flex items-center text-sm font-medium text-gray-500">
                {item.icon && (
                  <item.icon className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" aria-hidden="true" />
                )}
                {item.name}
              </span>
            ) : (
              <Link
                to={item.href}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-qaddumi-gold transition-colors"
              >
                {item.icon && (
                  <item.icon className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" aria-hidden="true" />
                )}
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string,
      icon: PropTypes.elementType,
    })
  ),
  className: PropTypes.string,
}

export default Breadcrumbs