import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  ScaleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import { useCartStore } from '../../store/cartStore'
import { useCompareStore } from '../../store/compareStore'
import { useAuthStore } from '../../store/authStore'
import MegaMenu from './MegaMenu'
import SearchBar from './SearchBar'
import LangToggle from './LangToggle'
import WhatsAppButton from './WhatsAppButton'

const AppHeader = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { getTotals } = useCartStore()
  const { getCount: getCompareCount } = useCompareStore()
  const { isAuthenticated, user, isStaff } = useAuthStore()

  const { itemCount } = getTotals()
  const compareCount = getCompareCount()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
    setIsSearchOpen(false)
  }, [location])

  const mainNavItems = [
    { key: 'home', href: '/', label: t('nav.home') },
    { key: 'categories', href: '/categories', label: t('nav.categories'), hasMegaMenu: true },
    { key: 'brands', href: '/brands', label: t('nav.brands') },
    { key: 'services', href: '/services', label: t('nav.services') },
    { key: 'offers', href: '/offers', label: t('nav.offers') },
    { key: 'about', href: '/about', label: t('nav.about') },
    { key: 'contact', href: '/contact', label: t('nav.contact') },
  ]

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-qaddumi-charcoal text-qaddumi-offwhite text-sm py-2 hidden lg:block">
        <div className="container-qaddumi">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                <span dir="ltr">{t('store.phone')}</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                <span>{t('store.address')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <span className="text-xs">{t('store.hours')}</span>
              <WhatsAppButton 
                phone={import.meta.env.VITE_WHATSAPP_NUMBER}
                message={t('store.whatsappDefault')}
                className="text-green-400 hover:text-green-300"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : 'shadow-md'
        }`}
      >
        <div className="container-qaddumi">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={t('nav.menu')}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img 
                src="/images/logo.svg" 
                alt={t('store.name')}
                className="w-10 h-10 lg:w-12 lg:h-12"
              />
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-qaddumi-charcoal">
                  {t('store.name')}
                </h1>
                <p className="text-sm text-gray-600">
                  {t('store.established')}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
              {mainNavItems.map((item) => (
                <div key={item.key} className="relative group">
                  <Link
                    to={item.href}
                    className={`nav-link flex items-center space-x-1 rtl:space-x-reverse py-2 ${
                      location.pathname === item.href ? 'nav-link-active' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasMegaMenu && (
                      <ChevronDownIcon className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                  
                  {item.hasMegaMenu && (
                    <MegaMenu />
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Search */}
              <button
                onClick={toggleSearch}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={t('nav.search')}
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Compare */}
              <Link
                to="/compare"
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={t('nav.compare')}
              >
                <ScaleIcon className="w-5 h-5" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-qaddumi-gold text-qaddumi-charcoal text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {compareCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              {import.meta.env.VITE_ENABLE_CART === 'true' && (
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label={t('nav.cart')}
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-qaddumi-gold text-qaddumi-charcoal text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Language Toggle */}
              <LangToggle />

              {/* User Menu */}
              <div className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse">
                {isAuthenticated ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 rtl:space-x-reverse p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-qaddumi-gold rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-qaddumi-charcoal">
                          {user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                    
                    {/* User Dropdown */}
                    <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                        >
                          {t('nav.account')}
                        </Link>
                        {isStaff() && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                          >
                            {t('nav.admin')}
                          </Link>
                        )}
                        <button
                          onClick={() => {/* Handle logout */}}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                        >
                          {t('nav.logout')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="btn-primary text-sm px-4 py-2"
                  >
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="border-t bg-white">
            <div className="container-qaddumi py-4">
              <SearchBar 
                onClose={() => setIsSearchOpen(false)}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="container-qaddumi py-4">
              <nav className="space-y-4">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    className={`block py-2 text-lg font-medium transition-colors ${
                      location.pathname === item.href 
                        ? 'text-qaddumi-gold' 
                        : 'text-gray-700 hover:text-qaddumi-gold'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile User Actions */}
                <div className="border-t pt-4 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/account"
                        className="block py-2 text-lg font-medium text-gray-700 hover:text-qaddumi-gold transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('nav.account')}
                      </Link>
                      {isStaff() && (
                        <Link
                          to="/admin"
                          className="block py-2 text-lg font-medium text-gray-700 hover:text-qaddumi-gold transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('nav.admin')}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          // Handle logout
                          setIsMenuOpen(false)
                        }}
                        className="block py-2 text-lg font-medium text-gray-700 hover:text-qaddumi-gold transition-colors"
                      >
                        {t('nav.logout')}
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block py-2 text-lg font-medium text-qaddumi-gold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.login')}
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default AppHeader