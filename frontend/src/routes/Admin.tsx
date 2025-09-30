import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  BarChart3, 
  Package, 
  MapPin, 
  Calendar, 
  Settings, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Filter,
  Save,
  MessageSquare,
  DollarSign
} from 'lucide-react'
import { apiCall } from '@/lib/api'

interface Package {
  id: string
  name: string
  price: number
  features: string[]
  status: string
  category: string
}

interface Venue {
  id: string
  name: string
  location: any
  capacity: any
  pricing: any
  rating: number
  status: string
}

interface Booking {
  id: string
  bookingId: string
  customer: any
  package: any
  venue: any
  event: any
  status: string
  pricing: any
  createdAt: string
}

export function Admin() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [packages, setPackages] = useState<Package[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [showAddPackage, setShowAddPackage] = useState(false)
  const [showAddVenue, setShowAddVenue] = useState(false)

  // Form states
  const [packageForm, setPackageForm] = useState({
    name: '',
    description: '',
    price: '',
    features: '',
    category: 'standard',
    duration: '1',
    maxGuests: '100',
    status: 'active'
  })

  const [venueForm, setVenueForm] = useState({
    name: '',
    description: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
    minCapacity: '',
    maxCapacity: '',
    basePrice: '',
    status: 'available'
  })

  useEffect(() => {
    if (activeTab === 'packages') fetchPackages()
    if (activeTab === 'venues') fetchVenues()
    if (activeTab === 'bookings') fetchBookings()
  }, [activeTab])

  const fetchPackages = async () => {
    try {
      const response = await apiCall('/packages')
      if (response.ok) {
        const data = await response.json()
        setPackages(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  const fetchVenues = async () => {
    try {
      const response = await apiCall('/venues')
      if (response.ok) {
        const data = await response.json()
        setVenues(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching venues:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await apiCall('/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleAddPackage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const features = packageForm.features.split(',').map(f => f.trim()).filter(f => f)
      const response = await apiCall('/packages', {
        method: 'POST',
        body: JSON.stringify({
          ...packageForm,
          price: parseFloat(packageForm.price),
          duration: parseInt(packageForm.duration),
          maxGuests: parseInt(packageForm.maxGuests),
          features
        })
      })

      if (response.ok) {
        alert('Package added successfully!')
        setShowAddPackage(false)
        setPackageForm({
          name: '', description: '', price: '', features: '', 
          category: 'standard', duration: '1', maxGuests: '100', status: 'active'
        })
        fetchPackages()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error adding package:', error)
      alert('Failed to add package')
    }
  }

  const handleAddVenue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await apiCall('/venues', {
        method: 'POST',
        body: JSON.stringify({
          name: venueForm.name,
          description: venueForm.description,
          location: {
            street: venueForm.street,
            city: venueForm.city,
            state: venueForm.state,
            zipCode: venueForm.zipCode,
            country: venueForm.country
          },
          capacity: {
            min: parseInt(venueForm.minCapacity),
            max: parseInt(venueForm.maxCapacity)
          },
          pricing: {
            basePrice: parseFloat(venueForm.basePrice)
          },
          status: venueForm.status
        })
      })

      if (response.ok) {
        alert('Venue added successfully!')
        setShowAddVenue(false)
        setVenueForm({
          name: '', description: '', street: '', city: '', state: '', 
          zipCode: '', country: 'Bangladesh', minCapacity: '', maxCapacity: '', 
          basePrice: '', status: 'available'
        })
        fetchVenues()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error adding venue:', error)
      alert('Failed to add venue')
    }
  }



  const handleDeletePackage = async (packageId: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await apiCall(`/packages/${packageId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          alert('Package deleted successfully!')
          fetchPackages()
        } else {
          const error = await response.json()
          alert(`Error: ${error.message}`)
        }
      } catch (error) {
        console.error('Error deleting package:', error)
        alert('Failed to delete package')
      }
    }
  }

  const handleDeleteVenue = async (venueId: string) => {
    if (confirm('Are you sure you want to delete this venue?')) {
      try {
        const response = await apiCall(`/venues/${venueId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          alert('Venue deleted successfully!')
          fetchVenues()
        } else {
          const error = await response.json()
          alert(`Error: ${error.message}`)
        }
      } catch (error) {
        console.error('Error deleting venue:', error)
        alert('Failed to delete venue')
      }
    }
  }

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await apiCall(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        alert('Booking status updated successfully!')
        fetchBookings()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Failed to update booking status')
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Packages</p>
              <p className="text-2xl font-bold">{packages.filter(p => p.status === 'active').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">৳{bookings.reduce((sum, b) => sum + (b.pricing?.total || 0), 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Venues</p>
              <p className="text-2xl font-bold">{venues.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Recent Bookings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{booking.customer?.firstName} {booking.customer?.lastName}</p>
                    <p className="text-sm text-muted-foreground">{booking.package?.name || 'No Package'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">৳{booking.pricing?.total?.toLocaleString() || '0'}</p>
                  <p className="text-sm text-muted-foreground">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPackages = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Packages</h2>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setShowAddPackage(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add Package</span>
        </Button>
      </div>

      {showAddPackage && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Package</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPackage} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Package Name</Label>
                  <Input
                    id="name"
                    value={packageForm.name}
                    onChange={(e) => setPackageForm({...packageForm, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (৳)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={packageForm.price}
                    onChange={(e) => setPackageForm({...packageForm, price: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={packageForm.description}
                  onChange={(e) => setPackageForm({...packageForm, description: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={packageForm.category} onValueChange={(value: string) => setPackageForm({...packageForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={packageForm.duration}
                    onChange={(e) => setPackageForm({...packageForm, duration: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxGuests">Max Guests</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    value={packageForm.maxGuests}
                    onChange={(e) => setPackageForm({...packageForm, maxGuests: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={packageForm.features}
                  onChange={(e) => setPackageForm({...packageForm, features: e.target.value})}
                  placeholder="Decoration, Photography, Catering"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Add Package</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddPackage(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{pkg.name}</h3>
                    <p className="text-2xl font-bold text-purple-600">৳{pkg.price?.toLocaleString()}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {pkg.features?.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert(`Edit functionality coming soon for ${pkg.name}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert(`Package: ${pkg.name}\nPrice: ৳${pkg.price}\nStatus: ${pkg.status}\nFeatures: ${pkg.features?.join(', ')}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeletePackage(pkg.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderVenues = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Venues</h2>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setShowAddVenue(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add Venue</span>
        </Button>
      </div>

      {showAddVenue && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Venue</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddVenue} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="venueName">Venue Name</Label>
                  <Input
                    id="venueName"
                    value={venueForm.name}
                    onChange={(e) => setVenueForm({...venueForm, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="basePrice">Base Price (৳)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={venueForm.basePrice}
                    onChange={(e) => setVenueForm({...venueForm, basePrice: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="venueDescription">Description</Label>
                <Textarea
                  id="venueDescription"
                  value={venueForm.description}
                  onChange={(e) => setVenueForm({...venueForm, description: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={venueForm.street}
                    onChange={(e) => setVenueForm({...venueForm, street: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={venueForm.city}
                    onChange={(e) => setVenueForm({...venueForm, city: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={venueForm.state}
                    onChange={(e) => setVenueForm({...venueForm, state: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={venueForm.zipCode}
                    onChange={(e) => setVenueForm({...venueForm, zipCode: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={venueForm.country}
                    onChange={(e) => setVenueForm({...venueForm, country: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minCapacity">Min Capacity</Label>
                  <Input
                    id="minCapacity"
                    type="number"
                    value={venueForm.minCapacity}
                    onChange={(e) => setVenueForm({...venueForm, minCapacity: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxCapacity">Max Capacity</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    value={venueForm.maxCapacity}
                    onChange={(e) => setVenueForm({...venueForm, maxCapacity: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Add Venue</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddVenue(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {venues.map((venue) => (
          <Card key={venue.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{venue.name}</h3>
                    <p className="text-lg text-orange-600">৳{venue.pricing?.basePrice?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {venue.location?.city}, {venue.location?.state} • Capacity: {venue.capacity?.min}-{venue.capacity?.max} guests
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm">Rating: {venue.rating || 'N/A'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        venue.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {venue.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert(`Edit functionality coming soon for ${venue.name}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert(`Venue: ${venue.name}\nLocation: ${venue.location?.street}, ${venue.location?.city}\nCapacity: ${venue.capacity?.min}-${venue.capacity?.max} guests\nRating: ${venue.rating || 'N/A'}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteVenue(venue.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Bookings</h2>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </Button>
      </div>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Booking #{booking.bookingId}</h3>
                  <p className="text-lg text-blue-600">
                    {booking.customer?.firstName} {booking.customer?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.package?.name || 'No Package'} • {booking.venue?.name || 'No Venue'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Event: {new Date(booking.event?.date).toLocaleDateString()} • 
                    {booking.event?.guestCount} guests
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  ৳{booking.pricing?.total?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-2">
                                     <Select value={booking.status} onValueChange={(value: string) => handleUpdateBookingStatus(booking.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="emailNotif" defaultChecked />
            <Label htmlFor="emailNotif">Email Notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="smsNotif" />
            <Label htmlFor="smsNotif">SMS Notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="bookingAlerts" defaultChecked />
            <Label htmlFor="bookingAlerts">Booking Alerts</Label>
          </div>
          <Button className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>View and manage your messages</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="flex items-center space-x-2"
            onClick={() => alert('You have 3 unread messages:\n\n1. New booking request from Fatima Rahman\n2. Venue inquiry for March 25th\n3. Package customization request\n\nClick to view all messages and respond.')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your event services</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => alert('You have 3 unread messages:\n\n1. New booking request from Fatima Rahman\n2. Venue inquiry for March 25th\n3. Package customization request\n\nClick to view all messages and respond.')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'packages', label: 'Packages', icon: Package },
                  { id: 'venues', label: 'Venues', icon: MapPin },
                  { id: 'bookings', label: 'Bookings', icon: Calendar },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'packages' && renderPackages()}
            {activeTab === 'venues' && renderVenues()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  )
}
