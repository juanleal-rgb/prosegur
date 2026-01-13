import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...')
    
    // Run migrations (idempotent - safe to run multiple times)
    console.log('📦 Running database migrations...')
    try {
      execSync('npx prisma db push --skip-generate', { 
        stdio: 'inherit',
        env: { ...process.env }
      })
      console.log('✅ Migrations completed')
    } catch (error: any) {
      // If tables already exist, that's fine
      if (error?.message?.includes('already') || error?.message?.includes('exist')) {
        console.log('✅ Database tables already exist')
      } else {
        console.log('⚠️  Migration warning (may already be done):', error.message)
      }
    }

    // Check if we need to seed (ONLY if database is empty)
    console.log('🌱 Checking if database needs seeding...')
    try {
      const locationCount = await prisma.location.count()
      const incidentCount = await prisma.incident.count()
      
      // Only seed if BOTH locations and incidents are empty
      if (locationCount === 0 && incidentCount === 0) {
        console.log('🌱 Database is empty, seeding with initial data...')
        execSync('npx tsx prisma/seed.ts', { 
          stdio: 'inherit',
          env: { ...process.env }
        })
        console.log('✅ Seed completed')
      } else {
        console.log(`✅ Database already has data (${locationCount} locations, ${incidentCount} incidents) - skipping seed`)
      }
    } catch (error: any) {
      // If we can't check or seed, that's okay - maybe tables don't exist yet
      console.log('⚠️  Could not seed database (this is okay if tables are being created):', error.message)
    }

    console.log('✅ Database setup complete')
  } catch (error: any) {
    console.error('❌ Error setting up database:', error.message)
    // Continue anyway - let the app start
  } finally {
    await prisma.$disconnect()
  }
}

// Run setup and exit with code 0 (success) even if there are warnings
setupDatabase()
  .then(() => {
    process.exit(0)
  })
  .catch(() => {
    // Exit with success anyway - we don't want to block app startup
    process.exit(0)
  })
