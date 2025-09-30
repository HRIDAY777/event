import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Calendar, MapPin, Users, Star, Camera, Music, Flower2, Crown, Gem } from 'lucide-react'

export function Wedding() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')

  const weddingPackages = [
    {
      name: 'Basic Package',
      price: '৳50,000',
      features: ['Venue decoration', 'Basic catering', 'Photography', 'Basic music system'],
      popular: false
    },
    {
      name: 'Standard Package',
      price: '৳1,00,000',
      features: ['Premium decoration', 'Full catering', 'Professional photography', 'Live music', 'Transportation'],
      popular: true
    },
    {
      name: 'Premium Package',
      price: '৳2,00,000',
      features: ['Luxury decoration', '5-star catering', 'Cinematography', 'Live band', 'Luxury transportation', 'Wedding planner'],
      popular: false
    }
  ]

  const culturalEvents = [
    {
      name: 'Gaye Holud',
      description: 'Traditional turmeric ceremony with family and friends',
      icon: Flower2,
      duration: '2-3 hours'
    },
    {
      name: 'Mehendi Ceremony',
      description: 'Beautiful henna art ceremony for the bride',
      icon: Crown,
      duration: '3-4 hours'
    },
    {
      name: 'Nikah Ceremony',
      description: 'Islamic wedding ceremony with religious rituals',
      icon: Gem,
      duration: '1-2 hours'
    },
    {
      name: 'Reception',
      description: 'Grand celebration with dinner and entertainment',
      icon: Users,
      duration: '4-5 hours'
    }
  ]

  const venues = [
    {
      name: 'Dhaka Regency Hotel',
      location: 'Dhaka',
      capacity: '500 guests',
      price: '৳80,000',
      rating: 4.8,
      image: '/api/placeholder/400/250'
    },
    {
      name: 'Radisson Blu Water Garden',
      location: 'Dhaka',
      capacity: '800 guests',
      price: '৳1,20,000',
      rating: 4.9,
      image: '/api/placeholder/400/250'
    },
    {
      name: 'Pan Pacific Sonargaon',
      location: 'Dhaka',
      capacity: '1000 guests',
      price: '৳1,50,000',
      rating: 4.7,
      image: '/api/placeholder/400/250'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-rose-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('wedding.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {t('wedding.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-rose-600 hover:bg-gray-100"
              onClick={() => {
                setActiveTab('packages');
                // Scroll to packages section
                setTimeout(() => {
                  const packagesSection = document.querySelector('[data-tab="packages"]');
                  if (packagesSection) {
                    packagesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              {t('wedding.planWedding')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-rose-600"
              onClick={() => {
                setActiveTab('packages');
                // Scroll to packages section
                setTimeout(() => {
                  const packagesSection = document.querySelector('[data-tab="packages"]');
                  if (packagesSection) {
                    packagesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              {t('wedding.viewPackages')}
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 border-2 border-white rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['overview', 'packages', 'venues', 'cultural', 'gallery'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => {
                setActiveTab(tab);
                // Smooth scroll to specific tab content
                setTimeout(() => {
                  const tabSection = document.querySelector(`[data-tab="${tab}"]`);
                  if (tabSection) {
                    tabSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              className="capitalize transition-all duration-200 hover:scale-105"
            >
              {t(`wedding.tabs.${tab}`)}
            </Button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div data-tab="overview" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-rose-600" />
                </div>
                <CardTitle className="text-xl">{t('wedding.features.romantic')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('wedding.features.romanticDesc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle className="text-xl">{t('wedding.features.memories')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('wedding.features.memoriesDesc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Music className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">{t('wedding.features.entertainment')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('wedding.features.entertainmentDesc')}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'packages' && (
          <div data-tab="packages" className="grid md:grid-cols-3 gap-8 mb-12">
            {weddingPackages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'ring-2 ring-rose-500 scale-105' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-rose-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      {t('wedding.mostPopular')}
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-rose-600">{pkg.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Star className="w-4 h-4 text-rose-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6" 
                    variant={pkg.popular ? 'default' : 'outline'}
                    onClick={() => {
                      alert(`🎉 ${pkg.name} নির্বাচন করা হয়েছে!\n\nমূল্য: ${pkg.price}\n\nআমাদের team আপনার সাথে যোগাযোগ করবে।`);
                      // Scroll to contact section
                      setTimeout(() => {
                        const contactSection = document.querySelector('[data-tab="contact"]');
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 1000);
                    }}
                  >
                    {t('wedding.selectPackage')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'venues' && (
          <div data-tab="venues" className="grid md:grid-cols-3 gap-8 mb-12">
            {venues.map((venue, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-rose-200 to-pink-200 flex items-center justify-center">
                  <span className="text-muted-foreground">Venue Image</span>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{venue.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {venue.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('wedding.capacity')}:</span>
                      <span>{venue.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('wedding.price')}:</span>
                      <span className="font-semibold text-rose-600">{venue.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('wedding.rating')}:</span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {venue.rating}
                      </span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => alert(`🏨 ${venue.name}\n\nঅবস্থান: ${venue.location}\nধারণক্ষমতা: ${venue.capacity}\nমূল্য: ${venue.price}\nরেটিং: ⭐ ${venue.rating}\n\nআরও বিস্তারিত জানতে আমাদের সাথে যোগাযোগ করুন।`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'cultural' && (
          <div data-tab="cultural" className="grid md:grid-cols-2 gap-8 mb-12">
            {culturalEvents.map((event, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <event.icon className="w-8 h-8 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{event.name}</CardTitle>
                    <CardDescription className="mb-3">{event.description}</CardDescription>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {event.duration}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div data-tab="gallery" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-square bg-gradient-to-br from-rose-200 to-pink-200 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Wedding Photo {index + 1}</span>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div data-tab="contact" className="text-center py-12 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">{t('wedding.cta.title')}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('wedding.cta.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => alert('আমাদের সাথে যোগাযোগ করুন! 📞\n\nPhone: +880-1XXX-XXXXXX\nEmail: wedding@uservice.com')}
            >
              {t('wedding.cta.contact')}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => alert('বিনামূল্যে পরামর্শের জন্য! 💬\n\nআমাদের wedding planner আপনার সাথে যোগাযোগ করবে।')}
            >
              {t('wedding.cta.consultation')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
