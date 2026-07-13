import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations } from '../translations'

export type Language = 'zh' | 'en'

type TranslationType = typeof translations.zh

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: <K extends keyof TranslationType>(key: K) => TranslationType[K]
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language | null
    return saved || 'zh'
  })

  useEffect(() => {
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = <K extends keyof TranslationType>(key: K): TranslationType[K] => {
    return translations[lang][key]
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
