
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import PropTypes from 'prop-types'

const ErrorMessage = ({ 
  title = 'حدث خطأ', 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start">
        <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="ml-3 rtl:ml-0 rtl:mr-3">
          <h3 className="text-sm font-medium text-red-800 mb-1">
            {title}
          </h3>
          {message && (
            <p className="text-sm text-red-700 mb-3">
              {message}
            </p>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm font-medium text-red-800 hover:text-red-900 underline"
            >
              إعادة المحاولة
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

ErrorMessage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onRetry: PropTypes.func,
  className: PropTypes.string,
}

export default ErrorMessage