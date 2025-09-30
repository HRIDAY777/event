import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'

export function Tickets() {
  const { t } = useTranslation()
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({})

  const ticketTypes = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 199,
      originalPrice: 299,
      description: 'Limited time offer for early registrations',
      features: [
        'Full conference access',
        'Lunch included',
        'Networking session',
        'Digital materials'
      ],
      available: 50,
      sold: 30
    },
    {
      id: 'regular',
      name: 'Regular',
      price: 299,
      description: 'Standard conference ticket',
      features: [
        'Full conference access',
        'Lunch included',
        'Networking session',
        'Digital materials',
        'Swag bag'
      ],
      available: 200,
      sold: 120
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 499,
      description: 'Premium experience with exclusive benefits',
      features: [
        'Full conference access',
        'Premium lunch',
        'Exclusive networking session',
        'Digital materials',
        'Swag bag',
        'Meet & greet with speakers',
        'Priority seating',
        'VIP lounge access'
      ],
      available: 30,
      sold: 15
    }
  ]

  const handleQuantityChange = (ticketId: string, quantity: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: Math.max(0, quantity)
    }))
  }

  const getTotalPrice = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = ticketTypes.find(t => t.id === ticketId)
      return total + (ticket?.price || 0) * quantity
    }, 0)
  }

  const getTotalQuantity = () => {
    return Object.values(selectedTickets).reduce((total, quantity) => total + quantity, 0)
  }

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('tickets.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('tickets.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ticket Options */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {ticketTypes.map((ticket) => (
                <Card key={ticket.id} className="relative">
                  {ticket.originalPrice && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Save ${ticket.originalPrice - ticket.price}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{ticket.name}</CardTitle>
                        <CardDescription>{ticket.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-foreground">
                          ${ticket.price}
                        </div>
                        {ticket.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${ticket.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">What's included:</h4>
                        <ul className="space-y-2">
                          {ticket.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {ticket.available - ticket.sold} tickets remaining
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(ticket.id, (selectedTickets[ticket.id] || 0) - 1)}
                            disabled={(selectedTickets[ticket.id] || 0) <= 0}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{selectedTickets[ticket.id] || 0}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(ticket.id, (selectedTickets[ticket.id] || 0) + 1)}
                            disabled={(selectedTickets[ticket.id] || 0) >= (ticket.available - ticket.sold)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>{t('tickets.summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                  const ticket = ticketTypes.find(t => t.id === ticketId)
                  if (!ticket || quantity === 0) return null
                  
                  return (
                    <div key={ticketId} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{ticket.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                      </div>
                      <p className="font-medium">${ticket.price * quantity}</p>
                    </div>
                  )
                })}
                
                {getTotalQuantity() > 0 && (
                  <>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>{t('tickets.total')}</span>
                        <span>${getTotalPrice()}</span>
                      </div>
                    </div>
                    <Button className="w-full" size="lg">
                      {t('tickets.checkout')}
                    </Button>
                  </>
                )}
                
                {getTotalQuantity() === 0 && (
                  <p className="text-center text-muted-foreground">
                    Select tickets to see order summary
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Can I get a refund?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Refunds are available up to 30 days before the event. Please contact our support team for assistance.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Is lunch included?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes, lunch is included with all ticket types. VIP tickets include premium lunch options.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I transfer my ticket?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tickets are transferable up to 7 days before the event. Please contact us to arrange the transfer.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What if the event is cancelled?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  In case of cancellation, full refunds will be provided or tickets will be valid for the rescheduled date.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
