import { useTranslation } from 'react-i18next'
import { LanguageIcon } from '@heroicons/react/24/outline'

const LangToggle = ({ className = '' }) => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(newLang)
    
    // Update URL to include language
    const currentPath = window.location.pathname
    const searchParams = window.location.search
    
    // Remove current language prefix if exists
    const pathWithoutLang = currentPath.replace(/^\/(ar|en)/, '') || '/'
    
    // Add new language prefix
    const newPath = `/${newLang}${pathWithoutLang}`
    
    window.history.replaceState({}, '', newPath + searchParams)
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 rtl:space-x-reverse p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
      aria-label="Toggle language"
    >
      <LanguageIcon className="w-5 h-5" />
      <span className="text-sm font-medium">
        {i18n.language === 'ar' ? 'EN' : 'العربية'}
      </span>
    </button>
  )
}

export default LangToggle