import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

export function LangToggle() {
  const { language, changeLanguage } = useTranslation()

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'bn' : 'en'
    changeLanguage(newLang)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="p-2 font-medium"
      title={`Current language: ${language.toUpperCase()}`}
    >
      {language.toUpperCase()}
    </Button>
  )
}
