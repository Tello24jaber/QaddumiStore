import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import WhatsAppButton from './WhatsAppButton'

const AppFooter = () => {
  const { t, i18n } = useTranslation()
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { key: 'home', href: '/', label: t('nav.home') },
    { key: 'categories', href: '/categories', label: t('nav.categories') },
    { key: 'brands', href: '/brands', label: t('nav.brands') },
    { key: 'services', href: '/services', label: t('nav.services') },
    { key: 'offers', href: '/offers', label: t('nav.offers') },
    { key: 'about', href: '/about', label: t('nav.about') },
  ]

  const customerServiceLinks = [
    { key: 'contact', href: '/contact', label: t('nav.contact') },
    { key: 'support', href: '/support', label: t('nav.support') },
    { key: 'warranty', href: '/warranty', label: 'الضمان' },
    { key: 'returns', href: '/returns', label: 'سياسة الإرجاع' },
    { key: 'shipping', href: '/shipping', label: 'التوصيل' },
    { key: 'faq', href: '/faq', label: 'الأسئلة الشائعة' },
  ]

  const legalLinks = [
    { key: 'privacy', href: '/privacy', label: t('footer.privacy') },
    { key: 'terms', href: '/terms', label: t('footer.terms') },
    { key: 'sitemap', href: '/sitemap', label: t('footer.sitemap') },
  ]

  const socialLinks = [
    { 
      key: 'facebook', 
      href: 'https://facebook.com/qaddumi.electronics', 
      label: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    { 
      key: 'instagram', 
      href: 'https://instagram.com/qaddumi_electronics', 
      label: 'Instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.988 11.987c6.62 0 11.987-5.366 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.438 14.053 3.438 11.4 5.126 9.712c1.688-1.688 4.341-1.688 6.029 0l1.06 1.06-1.414 1.414-1.06-1.06c-.883-.883-2.31-.883-3.193 0-.883.883-.883 2.31 0 3.193.883.883 2.31.883 3.193 0l1.06-1.06 1.414 1.414-1.06 1.06c-.875.807-2.026 1.297-3.323 1.297z"/>
        </svg>
      )
    },
    { 
      key: 'youtube', 
      href: 'https://youtube.com/channel/qaddumi', 
      label: 'YouTube',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
  ]

  return (
    <footer className="bg-qaddumi-charcoal text-qaddumi-offwhite">
      {/* Main Footer */}
      <div className="container-qaddumi py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
              <img 
                src="/images/logo.svg" 
                alt={t('store.name')}
                className="w-12 h-12 brightness-0 invert"
              />
              <div>
                <h3 className="text-xl font-bold">{t('store.name')}</h3>
                <p className="text-sm text-gray-400">{t('store.established')}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('footer.aboutText')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
                <MapPinIcon className="w-4 h-4 text-qaddumi-gold flex-shrink-0" />
                <span>{t('store.address')}</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
                <PhoneIcon className="w-4 h-4 text-qaddumi-gold flex-shrink-0" />
                <span dir="ltr">{t('store.phone')}</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
                <EnvelopeIcon className="w-4 h-4 text-qaddumi-gold flex-shrink-0" />
                <span>{t('store.email')}</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm">
                <ClockIcon className="w-4 h-4 text-qaddumi-gold flex-shrink-0" />
                <div>
                  <div>{t('store.hours')}</div>
                  <div className="text-gray-400">{t('store.fridayHours')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-qaddumi-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer.customerService')}</h4>
            <ul className="space-y-3">
              {customerServiceLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-qaddumi-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer.newsletter')}</h4>
            <p className="text-gray-300 text-sm mb-4">
              {t('footer.newsletterText')}
            </p>
            
            {/* Newsletter Form */}
            <form className="mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder={t('footer.subscribeEmail')}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-qaddumi-gold focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-qaddumi-gold text-qaddumi-charcoal font-medium rounded-lg hover:bg-qaddumi-gold-dark transition-colors"
                >
                  {t('footer.subscribe')}
                </button>
              </div>
            </form>

            {/* Social Media */}
            <div>
              <h5 className="font-medium mb-4">{t('footer.followUs')}</h5>
              <div className="flex space-x-4 rtl:space-x-reverse">
                {socialLinks.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-qaddumi-gold hover:bg-gray-700 transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="mt-6 p-4 bg-green-900/20 rounded-lg border border-green-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <h6 className="font-medium text-green-400 mb-1">
                    تواصل سريع
                  </h6>
                  <p className="text-xs text-gray-300">
                    للاستفسارات الفورية
                  </p>
                </div>
                <WhatsAppButton
                  phone={import.meta.env.VITE_WHATSAPP_NUMBER}
                  message="مرحبا، أريد الاستفسار عن منتجاتكم"
                  className="text-green-400 hover:text-green-300"
                  showText={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-qaddumi py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 rtl:md:space-x-reverse">
              <p className="text-sm text-gray-400">
                © {currentYear} {t('footer.copyright')}
              </p>
              <div className="flex space-x-4 rtl:space-x-reverse">
                {legalLinks.map((link) => (
                  <Link
                    key={link.key}
                    to={link.href}
                    className="text-xs text-gray-400 hover:text-qaddumi-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Payment Methods & Certifications */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="text-xs text-gray-400">
                نقبل الدفع نقداً وبالبطاقات
              </div>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-5 bg-gray-700 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-white">VISA</span>
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-white">MC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button (Mobile) */}
      <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 md:hidden">
        <a
          href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/[^\d+]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors animate-bounce-gentle"
          aria-label="WhatsApp"
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </a>
      </div>
    </footer>
  )
}

export default AppFooter