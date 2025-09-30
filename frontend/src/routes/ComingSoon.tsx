import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

export function ComingSoon() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('common.comingSoon')}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            We're working hard to bring you something amazing. This feature is currently under development and will be available soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                {t('common.backToHome')}
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              Notify Me
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
