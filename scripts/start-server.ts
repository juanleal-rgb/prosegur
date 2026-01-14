import { spawn, type ChildProcess } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function quickSetup() {
  try {
    console.log('🔄 Quick database check...')
    
    // Quick check - just verify connection and count (with timeout)
    const locationCount = await Promise.race([
      prisma.location.count(),
      new Promise<number>((resolve) => setTimeout(() => resolve(0), 5000))
    ]).catch(() => 0) as number
    
    const incidentCount = await Promise.race([
      prisma.incident.count(),
      new Promise<number>((resolve) => setTimeout(() => resolve(0), 5000))
    ]).catch(() => 0) as number
    
    if (locationCount === 0 && incidentCount === 0) {
      console.log('🌱 Database is empty, will setup in background...')
      // Don't block - let Next.js start first
      setTimeout(async () => {
        try {
          const { execSync } = await import('child_process')
          execSync('npx prisma db push --skip-generate --accept-data-loss', { 
            stdio: 'inherit',
            timeout: 20000
          })
          execSync('npx tsx prisma/seed.ts', { 
            stdio: 'inherit',
            timeout: 20000
          })
          console.log('✅ Background setup completed')
        } catch (error: any) {
          console.log('⚠️  Background setup warning:', error.message)
        }
      }, 2000)
    } else {
      console.log(`✅ Database ready (${locationCount} locations, ${incidentCount} incidents)`)
    }
  } catch (error: any) {
    console.log('⚠️  Database check warning (continuing anyway):', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

let nextProcess: ChildProcess | null = null

// Handle shutdown signals gracefully
const shutdown = (signal: NodeJS.Signals) => {
  console.log(`\n📴 Received ${signal}, shutting down gracefully...`)
  if (nextProcess) {
    nextProcess.kill(signal)
  }
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// Run quick setup and then start Next.js
quickSetup()
  .then(() => {
    console.log('🚀 Starting Next.js server...')
    const port = process.env.PORT || '3000'
    console.log(`📡 Server will listen on port ${port}`)
    
    // Start Next.js
    nextProcess = spawn('next', ['start'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        PORT: port
      }
    })
    
    nextProcess.on('error', (error) => {
      console.error('❌ Error starting Next.js:', error)
      process.exit(1)
    })
    
    nextProcess.on('exit', (code) => {
      console.log(`\n📴 Next.js exited with code ${code}`)
      process.exit(code || 0)
    })
  })
  .catch((error) => {
    console.error('❌ Error in startup:', error)
    // Start Next.js anyway
    console.log('🚀 Starting Next.js server anyway...')
    const port = process.env.PORT || '3000'
    nextProcess = spawn('next', ['start'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        PORT: port
      }
    })
    
    nextProcess.on('exit', (code) => {
      console.log(`\n📴 Next.js exited with code ${code}`)
      process.exit(code || 0)
    })
  })
