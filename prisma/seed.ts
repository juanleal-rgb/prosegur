import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.incident.deleteMany()
  await prisma.location.deleteMany()

  // Create 3 Zara locations in Madrid
  const locations = [
    {
      name: 'Zara Gran Via',
      lat: 40.4194,
      lng: -3.7038,
      address: 'Gran Vía, 16, 28013 Madrid, Spain',
    },
    {
      name: 'Zara Castellana',
      lat: 40.4384,
      lng: -3.6833,
      address: 'Paseo de la Castellana, 79, 28046 Madrid, Spain',
    },
    {
      name: 'Zara Serrano',
      lat: 40.4321,
      lng: -3.6784,
      address: 'Calle de Serrano, 45, 28001 Madrid, Spain',
    },
  ]

  for (const location of locations) {
    await prisma.location.create({
      data: location,
    })
  }

  console.log('✅ Seed completed: Created 3 Zara locations in Madrid')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
