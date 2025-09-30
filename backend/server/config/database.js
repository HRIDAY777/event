import { Sequelize } from 'sequelize'
import { config } from './env.js'

// PostgreSQL Connection with Sequelize
export const sequelize = new Sequelize(config.DB_URL, {
  dialect: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  logging: config.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
})

// Database Connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log(`✅ PostgreSQL Connected: ${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`)
    
    // Sync all models (in development)
    if (config.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true })
      console.log('🔄 Database models synchronized')
    }
    
    // Handle connection events
    sequelize.addHook('beforeConnect', async (config) => {
      console.log('🔄 Attempting to connect to PostgreSQL...')
    })

    sequelize.addHook('afterConnect', async (connection) => {
      console.log('✅ Successfully connected to PostgreSQL')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await sequelize.close()
      console.log('🔄 PostgreSQL connection closed through app termination')
      process.exit(0)
    })

  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}
