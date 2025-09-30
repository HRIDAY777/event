import { useState } from 'react'
import { Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'

export function Schedule() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState('2024-03-15')

  // Mock data
  const schedule = {
    '2024-03-15': [
      {
        id: '1',
        time: '9:00 AM - 10:00 AM',
        title: 'Registration & Welcome Coffee',
        description: 'Check-in and networking',
        track: 'Main Hall',
        room: 'Lobby',
        speaker: 'Event Staff'
      },
      {
        id: '2',
        time: '10:00 AM - 11:00 AM',
        title: 'Keynote: Future of AI',
        description: 'Exploring the next decade of artificial intelligence',
        track: 'Main Stage',
        room: 'Grand Ballroom',
        speaker: 'Sarah Johnson'
      },
      {
        id: '3',
        time: '11:30 AM - 12:30 PM',
        title: 'Panel Discussion: Tech Trends',
        description: 'Industry leaders discuss emerging technologies',
        track: 'Panel Room',
        room: 'Conference Room A',
        speaker: 'Michael Chen, Emily Rodriguez'
      },
      {
        id: '4',
        time: '1:00 PM - 2:00 PM',
        title: 'Lunch & Networking',
        description: 'Catered lunch and networking session',
        track: 'Networking',
        room: 'Dining Hall',
        speaker: 'All Attendees'
      },
      {
        id: '5',
        time: '2:30 PM - 4:00 PM',
        title: 'Workshop: Building Scalable Apps',
        description: 'Hands-on workshop with practical examples',
        track: 'Workshop',
        room: 'Lab Room 1',
        speaker: 'Michael Chen'
      },
      {
        id: '6',
        time: '4:00 PM - 5:00 PM',
        title: 'Closing Remarks',
        description: 'Wrap-up and next steps',
        track: 'Main Stage',
        room: 'Grand Ballroom',
        speaker: 'Event Organizers'
      }
    ]
  }

  const dates = [
    { date: '2024-03-15', label: 'Day 1 - March 15' },
    { date: '2024-03-16', label: 'Day 2 - March 16' },
    { date: '2024-03-17', label: 'Day 3 - March 17' }
  ]

  const currentSchedule = schedule[selectedDate as keyof typeof schedule] || []

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('schedule.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('schedule.subtitle')}
          </p>
        </div>

        {/* Date Selector */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {dates.map((date) => (
              <Button
                key={date.date}
                variant={selectedDate === date.date ? 'default' : 'outline'}
                onClick={() => setSelectedDate(date.date)}
              >
                {date.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="max-w-4xl mx-auto">
          {currentSchedule.length > 0 ? (
            <div className="space-y-6">
              {currentSchedule.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 text-primary font-medium mb-2">
                          <Clock className="w-4 h-4" />
                          {session.time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {session.room}
                        </div>
                      </div>
                      <div className="lg:col-span-3">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {session.title}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          {session.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {session.track}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Speaker: {session.speaker}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No sessions scheduled for this date.
              </p>
              <Button variant="outline">
                View Other Days
              </Button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-sm">Main Stage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Panel Room</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Workshop</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Networking</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
