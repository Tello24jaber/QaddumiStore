import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { productsAPI } from '../lib/api'

export const useProducts = (params = {}) => {
  const { i18n } = useTranslation()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await productsAPI.getAll({
          locale: i18n.language,
          ...params
        })
        
        setProducts(response.data || response)
        setPagination(response.pagination)
        setError(null)
      } catch (err) {
        setError(err.message)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [i18n.language, JSON.stringify(params)])

  return { products, isLoading, error, pagination }
}

export const useProduct = (slug) => {
  const { i18n } = useTranslation()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const data = await productsAPI.getBySlug(slug, i18n.language)
        setProduct(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [slug, i18n.language])

  return { product, isLoading, error }
}
