import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { brandsAPI } from '../../lib/api'
import { getImageUrl } from '../../lib/utils'
import LoadingSpinner from '../common/LoadingSpinner'

const ShopByBrand = () => {
  const { i18n } = useTranslation()
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true)
        const data = await brandsAPI.getAll(i18n.language)
        setBrands(data.slice(0, 12)) // Show top 12 brands
      } catch (error) {
        console.error('Error fetching brands:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBrands()
  }, [i18n.language])

  const getBrandName = (brand) => {
    return i18n.language === 'ar' ? brand.name_ar : brand.name_en
  }

  if (isLoading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {brands.map((brand, index) => (
        <Link
          key={brand.id}
          to={`/brands/${brand.slug}`}
          className="group animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 border border-gray-100">
            {/* Brand Logo */}
            <div className="h-16 flex items-center justify-center mb-4">
              {brand.logo_url ? (
                <img
                  src={getImageUrl(brand.logo_url)}
                  alt={getBrandName(brand)}
                  className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400 group-hover:text-qaddumi-gold transition-colors">
                    {getBrandName(brand).charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Brand Name */}
            <h3 className="font-medium text-gray-900 group-hover:text-qaddumi-gold transition-colors">
              {getBrandName(brand)}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ShopByBrand