import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  EllipsisHorizontalIcon 
} from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  showInfo = true,
  totalItems = 0,
  itemsPerPage = 20,
  className = '' 
}) => {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Info */}
      {showInfo && totalItems > 0 && (
        <div className="text-sm text-gray-700">
          {t('filter.showingResults', {
            count: `${startItem}-${endItem}`,
            total: totalItems
          })}
        </div>
      )}

      {/* Pagination */}
      <nav className="flex items-center space-x-1 rtl:space-x-reverse">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg border transition-colors ${
            currentPage === 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          aria-label={t('common.previous')}
        >
          {isRTL ? (
            <ChevronRightIcon className="w-4 h-4" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4" />
          )}
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2">
                <EllipsisHorizontalIcon className="w-4 h-4 text-gray-400" />
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'border-qaddumi-gold bg-qaddumi-gold text-qaddumi-charcoal'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )}
          </div>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg border transition-colors ${
            currentPage === totalPages
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          aria-label={t('common.next')}
        >
          {isRTL ? (
            <ChevronLeftIcon className="w-4 h-4" />
          ) : (
            <ChevronRightIcon className="w-4 h-4" />
          )}
        </button>
      </nav>
    </div>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  showInfo: PropTypes.bool,
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  className: PropTypes.string,
}

export default Pagination