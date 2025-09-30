import { sequelize } from './database.js'
import { User } from '../models/User.js'
import { Package } from '../models/Package.js'
import { Venue } from '../models/Venue.js'
import bcrypt from 'bcryptjs'

const seed = async () => {
  try {
    console.log('🔄 Starting database seeding...')
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@uservice.com',
      password: adminPassword,
      role: 'admin',
      company: 'UService',
      phone: '+8801712345678',
      address: 'Dhaka, Bangladesh',
      isActive: true,
      emailVerified: true
    })
    console.log('✅ Admin user created:', adminUser.email)
    
    // Create manager user
    const managerPassword = await bcrypt.hash('manager123', 12)
    const managerUser = await User.create({
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@uservice.com',
      password: managerPassword,
      role: 'manager',
      company: 'UService',
      phone: '+8801712345679',
      address: 'Dhaka, Bangladesh',
      isActive: true,
      emailVerified: true
    })
    console.log('✅ Manager user created:', managerUser.email)
    
    // Create sample packages
    const packages = await Package.bulkCreate([
      {
        name: 'Basic Wedding Package',
        description: 'Perfect for intimate weddings with essential services',
        price: 50000,
        features: ['Decoration', 'Photography', 'Catering for 50 guests', 'Basic Sound System'],
        category: 'basic',
        duration: 1,
        maxGuests: 50,
        status: 'active',
        isPopular: false,
        createdBy: adminUser.id,
        tags: ['wedding', 'basic', 'affordable'],
        terms: '50% advance payment required',
        cancellationPolicy: '7 days notice required for cancellation'
      },
      {
        name: 'Premium Wedding Package',
        description: 'Luxury wedding experience with premium services',
        price: 150000,
        features: ['Premium Decoration', 'Professional Photography & Videography', 'Catering for 200 guests', 'Live Band', 'Wedding Car', 'Makeup Artist'],
        category: 'premium',
        duration: 2,
        maxGuests: 200,
        status: 'active',
        isPopular: true,
        createdBy: adminUser.id,
        tags: ['wedding', 'premium', 'luxury'],
        terms: '60% advance payment required',
        cancellationPolicy: '14 days notice required for cancellation'
      }
    ])
    console.log('✅ Sample packages created:', packages.length)
    
    // Create sample venues
    const venues = await Venue.bulkCreate([
      {
        name: 'Royal Garden Hall',
        description: 'Elegant outdoor venue perfect for weddings and receptions',
        location: {
          street: '123 Garden Road',
          city: 'Dhaka',
          state: 'Dhaka Division',
          zipCode: '1200',
          country: 'Bangladesh'
        },
        capacity: { min: 100, max: 500 },
        pricing: {
          basePrice: 25000,
          perPerson: 500,
          overtimeRate: 2000,
          deposit: 10000
        },
        amenities: ['Parking', 'Garden', 'Restrooms', 'Kitchen', 'Power Backup'],
        status: 'available',
        rating: 4.5,
        createdBy: adminUser.id,
        tags: ['outdoor', 'garden', 'elegant'],
        features: ['Natural Beauty', 'Spacious', 'Accessible']
      },
      {
        name: 'Grand Ballroom',
        description: 'Luxurious indoor venue for grand celebrations',
        location: {
          street: '456 Luxury Street',
          city: 'Dhaka',
          state: 'Dhaka Division',
          zipCode: '1200',
          country: 'Bangladesh'
        },
        capacity: { min: 200, max: 1000 },
        pricing: {
          basePrice: 50000,
          perPerson: 800,
          overtimeRate: 5000,
          deposit: 20000
        },
        amenities: ['Air Conditioning', 'Parking', 'Restrooms', 'Kitchen', 'Sound System', 'Lighting'],
        status: 'available',
        rating: 4.8,
        createdBy: adminUser.id,
        tags: ['indoor', 'luxury', 'grand'],
        features: ['Climate Controlled', 'Professional Setup', 'Premium Services']
      }
    ])
    console.log('✅ Sample venues created:', venues.length)
    
    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📋 Default Login Credentials:')
    console.log('Admin: admin@uservice.com / admin123')
    console.log('Manager: manager@uservice.com / manager123')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
}
