import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { categoriesAPI } from '../lib/api'

export const useCategories = () => {
  const { i18n } = useTranslation()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const data = await categoriesAPI.getAll(i18n.language)
        setCategories(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [i18n.language])

  // Helper functions
  const getMainCategories = () => {
    return categories.filter(cat => cat.level === 0)
  }

  const getFeaturedCategories = () => {
    return categories.filter(cat => cat.featured)
  }

  const getSubCategories = (parentId) => {
    return categories.filter(cat => cat.parent_id === parentId)
  }

  return { 
    categories, 
    isLoading, 
    error, 
    getMainCategories,
    getFeaturedCategories,
    getSubCategories
  }
}

export const useCategory = (slug) => {
  const { i18n } = useTranslation()
  const [category, setCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    const fetchCategory = async () => {
      try {
        setIsLoading(true)
        const data = await categoriesAPI.getBySlug(slug, i18n.language)
        setCategory(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setCategory(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [slug, i18n.language])

  return { category, isLoading, error }
}
