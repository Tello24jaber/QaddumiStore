import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'

// Components
import FilterSidebar from '../../components/category/FilterSidebar'
import ProductCard from '../../components/product/ProductCard'
import Pagination from '../../components/common/Pagination'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'

// API and utilities
import { categoriesAPI, productsAPI } from '../../lib/api'
import { generateCategorySEO } from '../../lib/seo'
import { buildQueryString } from '../../lib/api'

const CategoryPage = () => {
  const { categorySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, i18n } = useTranslation()

  // State
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isProductsLoading, setIsProductsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [pageSize] = useState(20)

  // Get current filters from URL
  const getCurrentFilters = () => {
    const filters = {}
    
    // Parse URL parameters
    const brands = searchParams.getAll('brand')
    if (brands.length > 0) filters.brands = brands
    
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice || maxPrice) {
      filters.priceRange = {
        min: minPrice ? parseFloat(minPrice) : null,
        max: maxPrice ? parseFloat(maxPrice) : null
      }
    }
    
    const energyRating = searchParams.getAll('energy')
    if (energyRating.length > 0) filters.energyRating = energyRating
    
    if (searchParams.get('inStock') === 'true') filters.inStock = true
    if (searchParams.get('onSale') === 'true') filters.onSale = true
    
    return filters
  }

  const getCurrentSort = () => {
    return searchParams.get('sort') || 'popularity'
  }

  const getCurrentPage = () => {
    return parseInt(searchParams.get('page')) || 1
  }

  // Update URL parameters
  const updateURL = (newFilters, newSort, newPage = 1) => {
    const params = new URLSearchParams()
    
    // Add filters to URL
    if (newFilters.brands?.length > 0) {
      newFilters.brands.forEach(brand => params.append('brand', brand))
    }
    
    if (newFilters.priceRange?.min) {
      params.set('minPrice', newFilters.priceRange.min.toString())
    }
    
    if (newFilters.priceRange?.max) {
      params.set('maxPrice', newFilters.priceRange.max.toString())
    }
    
    if (newFilters.energyRating?.length > 0) {
      newFilters.energyRating.forEach(rating => params.append('energy', rating))
    }
    
    if (newFilters.inStock) params.set('inStock', 'true')
    if (newFilters.onSale) params.set('onSale', 'true')
    
    // Add sort and page
    if (newSort && newSort !== 'popularity') params.set('sort', newSort)
    if (newPage > 1) params.set('page', newPage.toString())
    
    setSearchParams(params)
  }

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true)
        const categoryData = await categoriesAPI.getBySlug(categorySlug, i18n.language)
        setCategory(categoryData)
        setError(null)
      } catch (err) {
        console.error('Error fetching category:', err)
        setError('Failed to load category')
      } finally {
        setIsLoading(false)
      }
    }

    if (categorySlug) {
      fetchCategory()
    }
  }, [categorySlug, i18n.language])

  // Fetch products when filters/sort/page change
  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return

      try {
        setIsProductsLoading(true)
        
        const currentFilters = getCurrentFilters()
        const currentSort = getCurrentSort()
        const page = getCurrentPage()
        
        setCurrentPage(page)

        const response = await categoriesAPI.getProducts(category.id, {
          page,
          pageSize,
          sort: currentSort,
          locale: i18n.language,
          ...currentFilters
        })

        setProducts(response.data)
        setTotalPages(response.pagination.totalPages)
        setTotalProducts(response.pagination.total)
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products')
      } finally {
        setIsProductsLoading(false)
      }
    }

    fetchProducts()
  }, [category, searchParams, i18n.language, pageSize])

  // Fetch available filters
  useEffect(() => {
    const fetchFilters = async () => {
      if (!category) return

      try {
        // This would typically come from a separate API endpoint
        // For now, we'll create mock filter data
        const mockFilters = {
          brands: [
            { id: '1', name_ar: 'سامسونج', name_en: 'Samsung', count: 25 },
            { id: '2', name_ar: 'إل جي', name_en: 'LG', count: 18 },
            { id: '3', name_ar: 'بوش', name_en: 'Bosch', count: 12 },
          ],
          priceRange: {
            min: 500,
            max: 5000,
            ranges: [
              { min: 500, max: 1000 },
              { min: 1000, max: 2000 },
              { min: 2000, max: 3000 },
              { min: 3000, max: 5000 }
            ]
          },
          attributes: [
            {
              id: '1',
              code: 'energy_rating',
              name_ar: 'تصنيف الطاقة',
              name_en: 'Energy Rating',
              values: [
                { id: 'a+++', value_ar: 'A+++', value_en: 'A+++', count: 15 },
                { id: 'a++', value_ar: 'A++', value_en: 'A++', count: 20 },
                { id: 'a+', value_ar: 'A+', value_en: 'A+', count: 18 }
              ]
            }
          ]
        }
        
        setFilters(mockFilters)
      } catch (err) {
        console.error('Error fetching filters:', err)
      }
    }

    fetchFilters()
  }, [category])

  const getCategoryName = () => {
    return i18n.language === 'ar' ? category?.name_ar : category?.name_en
  }

  const getCategoryDescription = () => {
    return i18n.language === 'ar' ? category?.description_ar : category?.description_en
  }

  const handleFilterChange = (filterType, value) => {
    const currentFilters = getCurrentFilters()
    const newFilters = { ...currentFilters, [filterType]: value }
    
    // Remove empty filters
    Object.keys(newFilters).forEach(key => {
      if (!newFilters[key] || (Array.isArray(newFilters[key]) && newFilters[key].length === 0)) {
        delete newFilters[key]
      }
    })
    
    updateURL(newFilters, getCurrentSort(), 1) // Reset to page 1 when filters change
  }

  const handleSortChange = (newSort) => {
    updateURL(getCurrentFilters(), newSort, 1) // Reset to page 1 when sort changes
  }

  const handlePageChange = (newPage) => {
    updateURL(getCurrentFilters(), getCurrentSort(), newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearAllFilters = () => {
    updateURL({}, getCurrentSort(), 1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="جاري تحميل الفئة..." />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="container-qaddumi py-16">
        <ErrorMessage
          title="خطأ في تحميل الفئة"
          message={error || 'الفئة غير موجودة'}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  // Generate SEO data
  const seo = generateCategorySEO(category, i18n.language)

  // Breadcrumb items
  const breadcrumbItems = [
    {
      name: getCategoryName()
    }
  ]

  const sortOptions = [
    { value: 'popularity', label: t('filter.popularity') },
    { value: 'newest', label: t('filter.newest') },
    { value: 'price_asc', label: t('filter.priceLowToHigh') },
    { value: 'price_desc', label: t('filter.priceHighToLow') },
    { value: 'name_asc', label: t('filter.nameAZ') },
    { value: 'name_desc', label: t('filter.nameZA') }
  ]

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        {seo.meta.map((meta, index) => (
          <meta key={index} {...meta} />
        ))}
        {seo.link?.map((link, index) => (
          <link key={index} {...link} />
        ))}
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container-qaddumi py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} className="mb-8" />

          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {getCategoryName()}
            </h1>
            {getCategoryDescription() && (
              <p className="text-lg text-gray-600 max-w-3xl">
                {getCategoryDescription()}
              </p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                appliedFilters={getCurrentFilters()}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAllFilters}
              />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-lg shadow-soft p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  {/* Results Count & Mobile Filter Button */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {isProductsLoading ? (
                        'جاري التحميل...'
                      ) : (
                        t('filter.showingResults', {
                          count: `${((currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, totalProducts)}`,
                          total: totalProducts
                        })
                      )}
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="lg:hidden flex items-center space-x-2 rtl:space-x-reverse bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                    >
                      <FunnelIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">الفلاتر</span>
                    </button>
                  </div>

                  {/* Sort & View Options */}
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* Sort Dropdown */}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <label className="text-sm text-gray-700">{t('filter.sortBy')}:</label>
                      <select
                        value={getCurrentSort()}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-qaddumi-gold focus:border-qaddumi-gold"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="hidden sm:flex items-center border border-gray-300 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'grid' 
                            ? 'bg-qaddumi-gold text-qaddumi-charcoal' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        aria-label="Grid view"
                      >
                        <Squares2X2Icon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'list' 
                            ? 'bg-qaddumi-gold text-qaddumi-charcoal' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        aria-label="List view"
                      >
                        <ListBulletIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {isProductsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <LoadingSpinner size="lg" text="جاري تحميل المنتجات..." />
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8'
                      : 'space-y-6 mb-8'
                  }>
                    {products.map((product, index) => (
                      <div 
                        key={product.id} 
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <ProductCard
                          product={product}
                          className={viewMode === 'list' ? 'flex flex-row space-x-4 p-4' : ''}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={totalProducts}
                    itemsPerPage={pageSize}
                    className="justify-center"
                  />
                </>
              ) : (
                <EmptyState
                  type="products"
                  title="لا توجد منتجات"
                  description="لا توجد منتجات تطابق معايير البحث المحددة"
                  actionText="مسح الفلاتر"
                  onAction={handleClearAllFilters}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowMobileFilters(false)}
            />
            
            {/* Filter Panel */}
            <div className="fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 w-80 bg-white shadow-xl z-51 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">الفلاتر</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <FilterSidebar
                  filters={filters}
                  appliedFilters={getCurrentFilters()}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAllFilters}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CategoryPage