import { useState, useEffect } from 'react'
import enTranslations from '@/lib/i18n/en.json'
import bnTranslations from '@/lib/i18n/bn.json'

type Language = 'en' | 'bn'
type TranslationKey = string

const translations = {
  en: enTranslations,
  bn: bnTranslations,
}

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const storedLang = localStorage.getItem('uservice-language') as Language
    if (storedLang && (storedLang === 'en' || storedLang === 'bn')) {
      setLanguage(storedLang)
    }
  }, [])

  const t = (key: TranslationKey): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('uservice-language', lang)
  }

  return {
    t,
    language,
    changeLanguage,
  }
}
