import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { categoriesAPI } from '../../lib/api'
import { getImageUrl } from '../../lib/utils'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'

const FeaturedCategories = () => {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeaturedCategories = async () => {
      try {
        setIsLoading(true)
        const data = await categoriesAPI.getAll(i18n.language)
        const featuredCategories = data.filter(cat => cat.featured && cat.level === 0)
        setCategories(featuredCategories.slice(0, 6)) // Limit to 6 categories
        setError(null)
      } catch (err) {
        console.error('Error fetching featured categories:', err)
        setError('Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedCategories()
  }, [i18n.language])

  const getCategoryName = (category) => {
    return i18n.language === 'ar' ? category.name_ar : category.name_en
  }

  const getCategoryDescription = (category) => {
    return i18n.language === 'ar' ? category.description_ar : category.description_en
  }

  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingSpinner size="lg" text="جاري تحميل الفئات..." />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        title="خطأ في تحميل الفئات"
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/c/${category.slug}`}
          className="group"
        >
          <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
            {/* Category Image */}
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden group-hover:bg-qaddumi-gold group-hover:bg-opacity-10 transition-colors">
              {category.image_url ? (
                <img
                  src={getImageUrl(category.image_url)}
                  alt={getCategoryName(category)}
                  className="w-full h-full object-cover"
                />
              ) : category.icon ? (
                <span className="text-2xl">{category.icon}</span>
              ) : (
                <svg className="w-8 h-8 text-gray-400 group-hover:text-qaddumi-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )}
            </div>

            {/* Category Name */}
            <h3 className="font-semibold text-gray-900 group-hover:text-qaddumi-gold transition-colors mb-2">
              {getCategoryName(category)}
            </h3>

            {/* Category Description */}
            {getCategoryDescription(category) && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {getCategoryDescription(category)}
              </p>
            )}

            {/* Hover Arrow */}
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-qaddumi-gold mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default FeaturedCategories