import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'
import { EventCard } from '@/components/shared/EventCard'
import { SpeakerCard } from '@/components/shared/SpeakerCard'
import { TestimonialSlider } from '@/components/shared/TestimonialSlider'
import { useNavigate } from 'react-router-dom'
import { Heart, Camera, Music } from 'lucide-react'

export function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Mock data for demonstration
  const featuredEvents = [
    {
      id: '1',
      title: 'Tech Conference 2024',
      date: '2024-03-15',
      location: 'San Francisco, CA',
      price: '$299',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
      category: 'conference'
    },
    {
      id: '2',
      title: 'Design Workshop',
      date: '2024-03-20',
      location: 'New York, NY',
      price: '$149',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
      category: 'workshop'
    },
    {
      id: '3',
      title: 'Startup Networking',
      date: '2024-03-25',
      location: 'Austin, TX',
      price: '$99',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop',
      category: 'networking'
    }
  ]

  const featuredSpeakers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'CEO & Founder',
      company: 'TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      expertise: 'Product Strategy',
      topics: ['Leadership', 'Innovation', 'Strategy']
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'CTO',
      company: 'InnovateLab',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      expertise: 'AI & Machine Learning',
      topics: ['Technology', 'AI', 'Digital Transformation']
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'Design Director',
      company: 'Creative Studio',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      expertise: 'UX/UI Design',
      topics: ['Design', 'UX', 'Creativity']
    }
  ]

  const handleGetStarted = () => {
    navigate('/wedding')
  }

  const handleLearnMore = () => {
    navigate('/about')
  }

  const handleViewEvents = () => {
    navigate('/events')
  }

  const handleContactUs = () => {
    navigate('/contact')
  }

  const handleBookNow = () => {
    navigate('/booking')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" onClick={handleGetStarted}>
                {t('hero.cta')}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3" onClick={handleLearnMore}>
                {t('hero.learnMore')}
              </Button>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button variant="default" onClick={handleViewEvents}>
                View Events
              </Button>
              <Button variant="secondary" onClick={handleContactUs}>
                Contact Us
              </Button>
              <Button variant="outline" onClick={handleBookNow}>
                Book Now
              </Button>
              <Button variant="ghost" onClick={handleLearnMore}>
                Learn More
              </Button>
              <Button variant="destructive" onClick={handleContactUs}>
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing events and experiences that will inspire and connect you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" onClick={handleViewEvents}>
              View All Events
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive event management solutions with attention to every detail
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="mb-4">Personalized Service</CardTitle>
              <CardDescription>
                Every event is unique, and we treat it that way. Our team works closely with you to create a truly personalized experience.
              </CardDescription>
            </Card>
            
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="mb-4">Professional Quality</CardTitle>
              <CardDescription>
                From planning to execution, we maintain the highest standards of professionalism and quality in everything we do.
              </CardDescription>
            </Card>
            
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="mb-4">Creative Solutions</CardTitle>
              <CardDescription>
                We bring creativity and innovation to every project, ensuring your event stands out and creates lasting memories.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Speakers */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Speakers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn from industry experts and thought leaders who share their insights and experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSpeakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear from the people who have experienced our services
            </p>
          </div>
          
          <TestimonialSlider />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Ready to Get Started?</CardTitle>
                <CardDescription>
                  Join thousands of event organizers who trust Uservice to create amazing experiences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={handleGetStarted}>
                    Start Your Free Trial
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleContactUs}>
                    Schedule a Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
