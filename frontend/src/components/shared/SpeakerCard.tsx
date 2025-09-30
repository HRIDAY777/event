import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

interface Speaker {
  id: string
  name: string
  title: string
  company: string
  image: string
  expertise: string
}

interface SpeakerCardProps {
  speaker: Speaker
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="mx-auto mb-4">
          <img
            src={speaker.image}
            alt={speaker.name}
            className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-primary/10"
          />
        </div>
        <CardTitle className="text-xl">{speaker.name}</CardTitle>
        <CardDescription className="text-base font-medium">
          {speaker.title}
        </CardDescription>
        <CardDescription className="text-sm text-primary">
          {speaker.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>{t('speakers.expertise')}:</strong>
          </p>
          <p className="text-sm font-medium">{speaker.expertise}</p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/speakers/${speaker.id}`}>
            {t('speakers.viewProfile')}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
