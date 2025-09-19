import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { searchAPI } from '../../lib/api'
import { debounce, getImageUrl } from '../../lib/utils'

const SearchBar = ({ onClose, autoFocus = false, className = '' }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const fetchSuggestions = debounce(async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const results = await searchAPI.autocomplete(searchQuery, i18n.language, 8)
      setSuggestions(results)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Search error:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, 300)

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    fetchSuggestions(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      handleClose()
    }
  }

  const handleSuggestionClick = (product) => {
    navigate(`/p/${product.slug}`)
    handleClose()
  }

  const handleClose = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    onClose?.()
  }

  const getProductName = (product) => {
    return i18n.language === 'ar' ? product.name_ar : product.name_en
  }

  const getBrandName = (product) => {
    return product.brand_name || product.brands?.[`name_${i18n.language}`]
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={t('nav.search')}
            className="w-full pl-10 rtl:pl-4 pr-10 rtl:pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-qaddumi-gold focus:border-qaddumi-gold transition-colors"
          />
          {(query || onClose) && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-qaddumi-gold mx-auto"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((product) => (
                <li key={product.id}>
                  <button
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 rtl:space-x-reverse"
                  >
                    {product.image && (
                      <img
                        src={getImageUrl(product.image)}
                        alt={getProductName(product)}
                        className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {getProductName(product)}
                      </h4>
                      {getBrandName(product) && (
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {getBrandName(product)}
                        </p>
                      )}
                      {product.price && (
                        <p className="text-sm font-semibold text-qaddumi-gold mt-1">
                          {product.price} {product.currency || 'ILS'}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-600">
              {t('common.noResults')}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar