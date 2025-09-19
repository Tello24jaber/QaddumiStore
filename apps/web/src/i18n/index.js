import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import arTranslations from './ar.js'
import enTranslations from './en.js'

const resources = {
  ar: {
    translation: arTranslations,
  },
  en: {
    translation: enTranslations,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // default language
    fallbackLng: 'ar',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    react: {
      useSuspense: false,
    },
  })

// Set document direction based on language
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
})

// Set initial direction
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = i18n.language

export default i18n