import { sequelize } from './database.js'
import { config } from './env.js'

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...')
    
    // Force sync all models (this will drop and recreate tables)
    // WARNING: This will delete all existing data
    if (config.NODE_ENV === 'development') {
      await sequelize.sync({ force: true })
      console.log('✅ Database tables created successfully')
    } else {
      // In production, use alter to preserve data
      await sequelize.sync({ alter: true })
      console.log('✅ Database tables updated successfully')
    }
    
    console.log('🎉 Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate()
}
