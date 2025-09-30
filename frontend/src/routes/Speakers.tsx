import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SpeakerCard } from '@/components/shared/SpeakerCard'
import { useTranslation } from '@/hooks/useTranslation'

export function Speakers() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const speakers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'CEO & Founder',
      company: 'TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      expertise: 'Product Strategy'
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'CTO',
      company: 'InnovateLab',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      expertise: 'AI & Machine Learning'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'Design Director',
      company: 'Creative Studio',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      expertise: 'UX/UI Design'
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'VP of Engineering',
      company: 'TechFlow',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      expertise: 'Software Architecture'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      title: 'Marketing Director',
      company: 'GrowthCo',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
      expertise: 'Digital Marketing'
    },
    {
      id: '6',
      name: 'Alex Thompson',
      title: 'Data Scientist',
      company: 'DataCorp',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      expertise: 'Data Analytics'
    }
  ]

  const filteredSpeakers = speakers.filter(speaker =>
    speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('speakers.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('speakers.subtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search speakers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mb-8 text-center">
          <p className="text-muted-foreground">
            Showing {filteredSpeakers.length} of {speakers.length} speakers
          </p>
        </div>

        {/* Speakers Grid */}
        {filteredSpeakers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpeakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No speakers found matching your search.
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
