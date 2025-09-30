import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

interface Event {
  id: string
  title: string
  date: string
  location: string
  price: string
  image: string
  category: string
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const { t } = useTranslation()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            {event.category}
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            {event.price}
          </span>
        </div>
        <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link to={`/events/${event.id}`}>
              {t('events.viewDetails')}
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            {t('events.bookNow')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
