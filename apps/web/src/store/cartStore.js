import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      services: [],
      isOpen: false,

      // Add item to cart
      addItem: (product, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find(item => item.id === product.id)

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({
            items: [...items, { ...product, quantity }],
          })
        }
      },

      // Remove item from cart
      removeItem: (productId) => {
        const { items } = get()
        set({
          items: items.filter(item => item.id !== productId),
        })
      },

      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        const { items } = get()
        set({
          items: items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          ),
        })
      },

      // Clear cart
      clearCart: () => {
        set({ items: [], services: [] })
      },

      // Add service
      addService: (service) => {
        const { services } = get()
        const existingService = services.find(s => s.id === service.id)

        if (!existingService) {
          set({
            services: [...services, service],
          })
        }
      },

      // Remove service
      removeService: (serviceId) => {
        const { services } = get()
        set({
          services: services.filter(service => service.id !== serviceId),
        })
      },

      // Toggle cart visibility
      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }))
      },

      // Open cart
      openCart: () => {
        set({ isOpen: true })
      },

      // Close cart
      closeCart: () => {
        set({ isOpen: false })
      },

      // Get cart totals
      getTotals: () => {
        const { items, services } = get()
        
        const itemsSubtotal = items.reduce((total, item) => {
          const price = item.sale_price || item.price
          return total + (price * item.quantity)
        }, 0)

        const servicesSubtotal = services.reduce((total, service) => {
          return total + service.price
        }, 0)

        const subtotal = itemsSubtotal + servicesSubtotal
        const tax = subtotal * 0.16 // 16% VAT
        const total = subtotal + tax

        return {
          itemsSubtotal,
          servicesSubtotal,
          subtotal,
          tax,
          total,
          itemCount: items.reduce((count, item) => count + item.quantity, 0),
        }
      },
    }),
    {
      name: 'qaddumi-cart',
    }
  )
)