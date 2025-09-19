import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { categoriesAPI } from '../../lib/api'
import { getImageUrl } from '../../lib/utils'

const MegaMenu = () => {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll(i18n.language)
        // Get main categories (level 0) and their children
        const mainCategories = data.filter(cat => cat.level === 0 && cat.featured)
        const categoriesWithChildren = mainCategories.map(mainCat => ({
          ...mainCat,
          children: data.filter(cat => cat.parent_id === mainCat.id)
        }))
        setCategories(categoriesWithChildren)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [i18n.language])

  const getCategoryName = (category) => {
    return i18n.language === 'ar' ? category.name_ar : category.name_en
  }

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
        <div className="container-qaddumi py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-qaddumi-gold"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
      <div className="container-qaddumi py-8">
        <div className="grid grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              {/* Main Category Header */}
              <Link
                to={`/c/${category.slug}`}
                className="flex items-center space-x-3 rtl:space-x-reverse group/item"
              >
                {category.image_url && (
                  <img
                    src={getImageUrl(category.image_url)}
                    alt={getCategoryName(category)}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-qaddumi-charcoal group-hover/item:text-qaddumi-gold transition-colors">
                    {getCategoryName(category)}
                  </h3>
                  {category.description_ar && (
                    <p className="text-sm text-gray-600 mt-1">
                      {i18n.language === 'ar' ? category.description_ar : category.description_en}
                    </p>
                  )}
                </div>
              </Link>

              {/* Subcategories */}
              {category.children.length > 0 && (
                <ul className="space-y-2 pl-4 rtl:pl-0 rtl:pr-4">
                  {category.children.slice(0, 6).map((subCategory) => (
                    <li key={subCategory.id}>
                      <Link
                        to={`/c/${subCategory.slug}`}
                        className="text-sm text-gray-600 hover:text-qaddumi-gold transition-colors"
                      >
                        {getCategoryName(subCategory)}
                      </Link>
                    </li>
                  ))}
                  {category.children.length > 6 && (
                    <li>
                      <Link
                        to={`/c/${category.slug}`}
                        className="text-sm text-qaddumi-gold hover:text-qaddumi-gold-dark font-medium transition-colors"
                      >
                        {t('common.viewAll')}
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}

          {/* Featured Promotion */}
          <div className="bg-gradient-qaddumi rounded-lg p-6 text-qaddumi-charcoal">
            <h3 className="font-bold text-lg mb-2">{t('home.sections.specialOffers')}</h3>
            <p className="text-sm mb-4">
              خصومات تصل إلى 30% على الأجهزة المختارة
            </p>
            <Link
              to="/offers"
              className="inline-flex items-center text-sm font-medium hover:underline"
            >
              {t('common.viewAll')}
              <svg className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MegaMenu