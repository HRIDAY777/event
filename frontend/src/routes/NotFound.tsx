import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

export function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-6">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t('common.notFound')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                {t('common.backToHome')}
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
