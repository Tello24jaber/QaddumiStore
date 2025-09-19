import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { formatPrice } from '../../lib/utils'
import PropTypes from 'prop-types'

const FilterSidebar = ({ 
  filters = {},
  appliedFilters = {},
  onFilterChange,
  onClearAll,
  className = '' 
}) => {
  const { t, i18n } = useTranslation()
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    attributes: true,
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleFilterChange = (filterType, value, checked) => {
    const currentValues = appliedFilters[filterType] || []
    
    let newValues
    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter(v => v !== value)
    }
    
    onFilterChange?.(filterType, newValues)
  }

  const handlePriceRangeChange = (min, max) => {
    onFilterChange?.('priceRange', { min, max })
  }

  const getAppliedFiltersCount = () => {
    return Object.values(appliedFilters).reduce((count, values) => {
      if (Array.isArray(values)) {
        return count + values.length
      } else if (values && typeof values === 'object') {
        return count + (values.min || values.max ? 1 : 0)
      }
      return count
    }, 0)
  }

  const appliedCount = getAppliedFiltersCount()

  return (
    <div className={`bg-white rounded-lg shadow-soft p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <FunnelIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {t('filter.filters')}
          </h3>
          {appliedCount > 0 && (
            <span className="bg-qaddumi-gold text-qaddumi-charcoal text-xs px-2 py-1 rounded-full font-medium">
              {appliedCount}
            </span>
          )}
        </div>
        
        {appliedCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            {t('filter.clearAll')}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        {filters.priceRange && (
          <div>
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="font-medium text-gray-900">{t('filter.priceRange')}</h4>
              {expandedSections.price ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {expandedSections.price && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      {t('filter.minPrice')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={appliedFilters.priceRange?.min || ''}
                      onChange={(e) => handlePriceRangeChange(
                        e.target.value ? parseInt(e.target.value) : null,
                        appliedFilters.priceRange?.max
                      )}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-qaddumi-gold focus:border-qaddumi-gold"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      {t('filter.maxPrice')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={appliedFilters.priceRange?.max || ''}
                      onChange={(e) => handlePriceRangeChange(
                        appliedFilters.priceRange?.min,
                        e.target.value ? parseInt(e.target.value) : null
                      )}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-qaddumi-gold focus:border-qaddumi-gold"
                      placeholder="∞"
                    />
                  </div>
                </div>
                
                {/* Quick Price Ranges */}
                {filters.priceRange.ranges && (
                  <div className="space-y-2">
                    {filters.priceRange.ranges.map((range, index) => (
                      <button
                        key={index}
                        onClick={() => handlePriceRangeChange(range.min, range.max)}
                        className="block w-full text-left text-sm text-gray-600 hover:text-qaddumi-gold py-1"
                      >
                        {formatPrice(range.min, 'ILS', i18n.language)} - {formatPrice(range.max, 'ILS', i18n.language)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Brands */}
        {filters.brands && filters.brands.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('brand')}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="font-medium text-gray-900">{t('filter.brand')}</h4>
              {expandedSections.brand ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {expandedSections.brand && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {filters.brands.map((brand) => {
                  const brandName = i18n.language === 'ar' ? brand.name_ar : brand.name_en
                  const isChecked = appliedFilters.brands?.includes(brand.id) || false
                  
                  return (
                    <label key={brand.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleFilterChange('brands', brand.id, e.target.checked)}
                        className="w-4 h-4 text-qaddumi-gold bg-gray-100 border-gray-300 rounded focus:ring-qaddumi-gold focus:ring-2"
                      />
                      <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm text-gray-700">
                        {brandName} {brand.count && `(${brand.count})`}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Attributes */}
        {filters.attributes && filters.attributes.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('attributes')}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="font-medium text-gray-900">{t('filter.features')}</h4>
              {expandedSections.attributes ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {expandedSections.attributes && (
              <div className="mt-3 space-y-4">
                {filters.attributes.map((attribute) => {
                  const attrName = i18n.language === 'ar' ? attribute.name_ar : attribute.name_en
                  
                  return (
                    <div key={attribute.id}>
                      <h5 className="text-sm font-medium text-gray-800 mb-2">
                        {attrName}
                      </h5>
                      <div className="space-y-2 pl-2 rtl:pl-0 rtl:pr-2">
                        {attribute.values?.map((value) => {
                          const valueName = i18n.language === 'ar' ? value.value_ar : value.value_en
                          const isChecked = appliedFilters[attribute.code]?.includes(value.id) || false
                          
                          return (
                            <label key={value.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleFilterChange(attribute.code, value.id, e.target.checked)}
                                className="w-4 h-4 text-qaddumi-gold bg-gray-100 border-gray-300 rounded focus:ring-qaddumi-gold focus:ring-2"
                              />
                              <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm text-gray-700">
                                {valueName} {value.count && `(${value.count})`}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Availability */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">{t('filter.availability')}</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={appliedFilters.inStock || false}
                onChange={(e) => handleFilterChange('inStock', e.target.checked, e.target.checked)}
                className="w-4 h-4 text-qaddumi-gold bg-gray-100 border-gray-300 rounded focus:ring-qaddumi-gold focus:ring-2"
              />
              <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm text-gray-700">
                {t('filter.inStock')}
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={appliedFilters.onSale || false}
                onChange={(e) => handleFilterChange('onSale', e.target.checked, e.target.checked)}
                className="w-4 h-4 text-qaddumi-gold bg-gray-100 border-gray-300 rounded focus:ring-qaddumi-gold focus:ring-2"
              />
              <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm text-gray-700">
                {t('filter.onSale')}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

FilterSidebar.propTypes = {
  filters: PropTypes.shape({
    priceRange: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
      ranges: PropTypes.arrayOf(PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
      })),
    }),
    brands: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name_ar: PropTypes.string.isRequired,
      name_en: PropTypes.string.isRequired,
      count: PropTypes.number,
    })),
    attributes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      name_ar: PropTypes.string.isRequired,
      name_en: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        value_ar: PropTypes.string.isRequired,
        value_en: PropTypes.string.isRequired,
        count: PropTypes.number,
      })),
    })),
  }),
  appliedFilters: PropTypes.object,
  onFilterChange: PropTypes.func,
  onClearAll: PropTypes.func,
  className: PropTypes.string,
}

export default FilterSidebar