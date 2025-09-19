import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

// Layout Components
import AppHeader from './components/common/AppHeader'
import AppFooter from './components/common/AppFooter'

// Pages
import Home from './pages/home/Home'
import CategoryPage from './pages/category/CategoryPage'
import ProductPage from './pages/product/ProductPage'
import ComparePage from './pages/compare/ComparePage'
import ServicesPage from './pages/services/ServicesPage'
import OffersPage from './pages/offers/OffersPage'
import AboutPage from './pages/about/AboutPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductsAdmin from './pages/admin/ProductsAdmin'
import CategoriesAdmin from './pages/admin/CategoriesAdmin'

// Hooks
import { useAuthStore } from './store/authStore'

// Utils
import { generateSEODefaults } from './lib/seo'

function App() {
  const { i18n } = useTranslation()
  const { initialize } = useAuthStore()

  useEffect(() => {
    // Initialize auth store
    initialize()

    // Set document direction based on language
    const handleLanguageChange = (lng) => {
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = lng
    }

    // Set initial direction
    handleLanguageChange(i18n.language)

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n, initialize])

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Header */}
          <AppHeader />
          
          {/* Main Content */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={<Home />} 
              />
              <Route 
                path="/:locale" 
                element={<Home />} 
              />
              
              {/* Category Routes */}
              <Route 
                path="/c/:categorySlug" 
                element={<CategoryPage />} 
              />
              <Route 
                path="/:locale/c/:categorySlug" 
                element={<CategoryPage />} 
              />
              
              {/* Product Routes */}
              <Route 
                path="/p/:productSlug" 
                element={<ProductPage />} 
              />
              <Route 
                path="/:locale/p/:productSlug" 
                element={<ProductPage />} 
              />
              
              {/* Compare Route */}
              <Route 
                path="/compare" 
                element={<ComparePage />} 
              />
              <Route 
                path="/:locale/compare" 
                element={<ComparePage />} 
              />
              
              {/* Services Route */}
              <Route 
                path="/services" 
                element={<ServicesPage />} 
              />
              <Route 
                path="/:locale/services" 
                element={<ServicesPage />} 
              />
              
              {/* Offers Route */}
              <Route 
                path="/offers" 
                element={<OffersPage />} 
              />
              <Route 
                path="/:locale/offers" 
                element={<OffersPage />} 
              />
              
              {/* About Route */}
              <Route 
                path="/about" 
                element={<AboutPage />} 
              />
              <Route 
                path="/:locale/about" 
                element={<AboutPage />} 
              />
              
              {/* Admin Routes - Protected */}
              <Route 
                path="/admin" 
                element={<AdminDashboard />} 
              />
              <Route 
                path="/admin/products" 
                element={<ProductsAdmin />} 
              />
              <Route 
                path="/admin/categories" 
                element={<CategoriesAdmin />} 
              />
              
              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      404 - Page Not Found
                    </h1>
                    <p className="text-gray-600 mb-8">
                      The page you're looking for doesn't exist.
                    </p>
                    <a 
                      href="/" 
                      className="bg-qaddumi-gold hover:bg-qaddumi-gold-dark text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Back to Home
                    </a>
                  </div>
                } 
              />
            </Routes>
          </main>
          
          {/* Footer */}
          <AppFooter />
          
          {/* Toast Notifications */}
          <Toaster 
            position={i18n.language === 'ar' ? 'top-left' : 'top-right'}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
              },
            }}
          />
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App