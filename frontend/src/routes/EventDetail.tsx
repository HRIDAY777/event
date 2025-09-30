import { Calendar, MapPin, DollarSign, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'

export function EventDetail() {
  const { t } = useTranslation()

  // Mock data - in real app this would come from API
  const event = {
    id: '1',
    title: 'Tech Conference 2024',
    date: '2024-03-15',
    time: '9:00 AM - 6:00 PM',
    location: 'San Francisco Convention Center',
    address: '123 Main Street, San Francisco, CA 94105',
    price: '$299',
    capacity: 500,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    category: 'conference',
    description: 'Join us for the biggest tech conference of the year! Learn from industry experts, network with peers, and discover the latest trends in technology.',
    agenda: [
      { time: '9:00 AM', title: 'Registration & Welcome Coffee', description: 'Check-in and networking' },
      { time: '10:00 AM', title: 'Keynote: Future of AI', description: 'Sarah Johnson, CEO TechCorp' },
      { time: '11:30 AM', title: 'Panel Discussion: Tech Trends', description: 'Industry leaders discuss emerging technologies' },
      { time: '1:00 PM', title: 'Lunch & Networking', description: 'Catered lunch and networking session' },
      { time: '2:30 PM', title: 'Workshop: Building Scalable Apps', description: 'Hands-on workshop with Michael Chen' },
      { time: '4:00 PM', title: 'Closing Remarks', description: 'Wrap-up and next steps' }
    ],
    speakers: [
      {
        id: '1',
        name: 'Sarah Johnson',
        title: 'CEO & Founder',
        company: 'TechCorp',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: '2',
        name: 'Michael Chen',
        title: 'CTO',
        company: 'InnovateLab',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    ]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {event.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {event.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {event.description}
              </p>
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{formatDate(event.date)}</p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{event.location}</p>
                      <p className="text-sm text-muted-foreground">{event.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <p className="font-medium">{event.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <p className="font-medium">{event.capacity} attendees</p>
                  </div>
                  <Button className="w-full" size="lg">
                    {t('events.bookNow')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Agenda */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Event Agenda</h2>
          <div className="space-y-4">
            {event.agenda.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <p className="font-medium text-primary">{item.time}</p>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Speakers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Featured Speakers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.speakers.map((speaker) => (
              <Card key={speaker.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{speaker.name}</h3>
                      <p className="text-sm text-muted-foreground">{speaker.title}</p>
                      <p className="text-sm text-primary">{speaker.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Ready to Join?</CardTitle>
              <CardDescription>
                Don't miss out on this amazing event. Book your ticket now!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  {t('events.bookNow')}
                </Button>
                <Button variant="outline" size="lg">
                  Share Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
