import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { productsAPI } from '../../lib/api'
import ProductCard from '../product/ProductCard'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'

const BestSellers = () => {
  const { i18n } = useTranslation()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setIsLoading(true)
        const data = await productsAPI.getBestSellers(i18n.language, 8)
        setProducts(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching best sellers:', err)
        setError('Failed to load best selling products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBestSellers()
  }, [i18n.language])

  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingSpinner size="lg" text="جاري تحميل المنتجات..." />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        title="خطأ في تحميل المنتجات"
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">لا توجد منتجات متاحة حالياً</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <ProductCard
            product={product}
            showBadge={true}
            badgeText="الأكثر مبيعاً"
            badgeColor="bg-green-500"
          />
        </div>
      ))}
    </div>
  )
}

export default BestSellers