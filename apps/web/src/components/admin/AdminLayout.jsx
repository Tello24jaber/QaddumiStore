import { useState, useEffect } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  TagIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'

// Store and utilities
import { useAuthStore } from '../../store/authStore'
import LangToggle from '../common/LangToggle'

const AdminLayout = ({ children }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const { user, isStaff, signOut } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Redirect if not staff
  useEffect(() => {
    if (!isStaff()) {
      window.location.href = '/'
    }
  }, [isStaff])

  const navigation = [
    {
      name: t('admin.dashboard'),
      href: '/admin',
      icon: ChartBarIcon,
    },
    {
      name: t('admin.products'),
      href: '/admin/products',
      icon: CubeIcon,
    },
    {
      name: t('admin.categories'),
      href: '/admin/categories',
      icon: TagIcon,
    },
    {
      name: 'العلامات التجارية',
      href: '/admin/brands',
      icon: ShoppingBagIcon,
    },
    {
      name: t('admin.quotes'),
      href: '/admin/quotes',
      icon: DocumentTextIcon,
    },
    {
      name: t('admin.orders'),
      href: '/admin/orders',
      icon: ShoppingBagIcon,
    },
    {
      name: 'الوسائط',
      href: '/admin/media',
      icon: PhotoIcon,
    },
    {
      name: t('admin.customers'),
      href: '/admin/customers',
      icon: UsersIcon,
    },
    {
      name: t('admin.settings'),
      href: '/admin/settings',
      icon: CogIcon,
    },
  ]

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const isCurrentPage = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(href)
  }

  if (!isStaff()) {
    return null // or loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/admin" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img 
                src="/images/logo.svg" 
                alt="Qaddumi"
                className="w-8 h-8"
              />
              <span className="text-lg font-semibold text-gray-900">
                لوحة التحكم
              </span>
            </Link>
            
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isCurrentPage(item.href)
                    ? 'bg-qaddumi-gold text-qaddumi-charcoal'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 ml-3 rtl:ml-0 rtl:mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <div className="w-8 h-8 bg-qaddumi-gold rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-qaddumi-charcoal">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  مدير
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HomeIcon className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                العودة للموقع
              </Link>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <LangToggle />
              
              {/* Notifications placeholder */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5A8.038 8.038 0 0119 7a8 8 0 10-16 0c0 1.25.291 2.432.809 3.5L1 14h5" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout