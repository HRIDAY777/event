import { Calendar, MapPin, Globe, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SpeakerDetail() {

  // Mock data - in real app this would come from API
  const speaker = {
    id: '1',
    name: 'Sarah Johnson',
    title: 'CEO & Founder',
    company: 'TechCorp',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    expertise: 'Product Strategy',
    bio: 'Sarah Johnson is a seasoned entrepreneur and product strategist with over 10 years of experience in the tech industry. She founded TechCorp in 2018 and has since grown it into a leading technology company with over 500 employees worldwide.',
    location: 'San Francisco, CA',
    website: 'https://techcorp.com',
    twitter: '@sarahjohnson',
    linkedin: 'sarah-johnson-techcorp',
    upcomingEvents: [
      {
        id: '1',
        title: 'Tech Conference 2024',
        date: '2024-03-15',
        location: 'San Francisco, CA',
        role: 'Keynote Speaker'
      },
      {
        id: '2',
        title: 'Product Summit',
        date: '2024-04-20',
        location: 'New York, NY',
        role: 'Panel Moderator'
      }
    ],
    pastEvents: [
      {
        id: '3',
        title: 'Startup Week 2023',
        date: '2023-11-10',
        location: 'Austin, TX',
        role: 'Workshop Leader'
      }
    ]
  }

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                    {speaker.name}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-1">
                    {speaker.title} at {speaker.company}
                  </p>
                  <p className="text-lg text-primary font-medium">
                    {speaker.expertise}
                  </p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                {speaker.bio}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" size="sm">
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </Button>
                <Button variant="outline" size="sm">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Speaker Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <p className="text-muted-foreground">{speaker.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <a href={speaker.website} className="text-primary hover:underline">
                      {speaker.website}
                    </a>
                  </div>
                  <Button className="w-full">
                    Contact Speaker
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {speaker.upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {speaker.pastEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
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
              <CardTitle>Interested in Booking {speaker.name}?</CardTitle>
              <CardDescription>
                Get in touch to discuss speaking opportunities and availability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Book for Event
                </Button>
                <Button variant="outline" size="lg">
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
