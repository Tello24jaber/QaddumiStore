import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_COMPARE_ITEMS = 4

export const useCompareStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add item to compare
      addItem: (product) => {
        const { items } = get()
        
        // Check if item already exists
        if (items.find(item => item.id === product.id)) {
          return { success: false, message: 'Product already in compare list' }
        }

        // Check if max items reached
        if (items.length >= MAX_COMPARE_ITEMS) {
          return { success: false, message: `Maximum ${MAX_COMPARE_ITEMS} products can be compared` }
        }

        set({
          items: [...items, product],
        })

        return { success: true, message: 'Product added to compare' }
      },

      // Remove item from compare
      removeItem: (productId) => {
        const { items } = get()
        set({
          items: items.filter(item => item.id !== productId),
        })
      },

      // Clear all items
      clearAll: () => {
        set({ items: [] })
      },

      // Check if item is in compare
      isInCompare: (productId) => {
        const { items } = get()
        return items.some(item => item.id === productId)
      },

      // Get compare count
      getCount: () => {
        const { items } = get()
        return items.length
      },

      // Check if can add more items
      canAddMore: () => {
        const { items } = get()
        return items.length < MAX_COMPARE_ITEMS
      },

      // Get comparison data with normalized attributes
      getComparisonData: () => {
        const { items } = get()
        
        if (items.length === 0) return { items: [], attributes: [] }

        // Extract all unique attributes
        const attributeSet = new Set()
        items.forEach(item => {
          if (item.specs) {
            Object.keys(item.specs).forEach(attr => attributeSet.add(attr))
          }
          // Add common attributes
          attributeSet.add('price')
          attributeSet.add('warranty_months')
          attributeSet.add('energy_rating')
          attributeSet.add('brand')
          attributeSet.add('category')
        })

        const attributes = Array.from(attributeSet).sort()

        return {
          items,
          attributes,
        }
      },
    }),
    {
      name: 'qaddumi-compare',
    }
  )
)