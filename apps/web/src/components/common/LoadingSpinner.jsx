
import PropTypes from 'prop-types'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'qaddumi-gold', 
  className = '',
  text = null 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    'qaddumi-gold': 'border-qaddumi-gold',
    'gray': 'border-gray-300',
    'white': 'border-white',
    'blue': 'border-blue-500',
    'green': 'border-green-500',
    'red': 'border-red-500'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  )
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['qaddumi-gold', 'gray', 'white', 'blue', 'green', 'red']),
  className: PropTypes.string,
  text: PropTypes.string,
}

export default LoadingSpinner