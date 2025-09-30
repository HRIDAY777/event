import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { Users, Award, Globe, Heart, Star, CheckCircle } from 'lucide-react'

export function About() {
  const navigate = useNavigate()

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'With over 15 years of experience in event management, Sarah leads our team with passion and innovation.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Michael brings technical expertise and ensures our platform delivers cutting-edge solutions for event organizers.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Design Director',
      bio: 'Emily creates beautiful, intuitive experiences that make event management a joy for our users.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Events Created' },
    { number: '50,000+', label: 'Happy Users' },
    { number: '150+', label: 'Countries Served' },
    { number: '99.9%', label: 'Uptime' }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'We\'re passionate about creating amazing events and experiences for our users.'
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from code quality to user experience.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We believe in building strong communities around events and shared experiences.'
    },
    {
      icon: CheckCircle,
      title: 'Reliability',
      description: 'Our users can count on us to deliver consistent, reliable service every time.'
    }
  ]

  const handleGetStarted = () => {
    navigate('/wedding')
  }

  const handleContactUs = () => {
    navigate('/contact')
  }

  const handleViewTeam = () => {
    navigate('/team')
  }

  const handleLearnMore = () => {
    navigate('/services')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About Uservice
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're on a mission to make event management simple, beautiful, and accessible to everyone
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" onClick={handleGetStarted}>
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3" onClick={handleContactUs}>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                At Uservice, we believe that every event has the potential to create meaningful connections and lasting memories. Our mission is to provide event organizers with the tools, resources, and support they need to bring their vision to life.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're planning a corporate conference, a wedding celebration, or a community gathering, we're here to help you succeed. Our platform combines cutting-edge technology with human-centered design to make event management intuitive, efficient, and enjoyable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleLearnMore}>
                  Learn More
                </Button>
                <Button variant="outline" onClick={handleViewTeam}>
                  Meet Our Team
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <Globe className="w-32 h-32 text-primary/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Numbers that tell the story of our growth and success
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="mb-3">{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Uservice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="mb-2">{member.name}</CardTitle>
                <CardDescription className="mb-4">{member.role}</CardDescription>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recognition & Awards
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Industry recognition for our innovation and excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="mb-3">Best Event Platform 2024</CardTitle>
              <CardDescription>
                Recognized by EventTech Awards for our innovative approach to event management
              </CardDescription>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="mb-3">Top Rated Platform</CardTitle>
              <CardDescription>
                Top-rated event management platform with 4.9/5 stars from our users
              </CardDescription>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="mb-3">Community Choice</CardTitle>
              <CardDescription>
                Voted favorite event platform by event organizers worldwide
              </CardDescription>
            </Card>
          </div>
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
