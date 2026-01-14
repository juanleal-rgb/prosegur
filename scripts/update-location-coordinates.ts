import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Updating location coordinates...')

  // Update Zara Gran Via
  const granVia = await prisma.location.updateMany({
    where: { name: 'Zara Gran Via' },
    data: {
      lat: 40.42036,
      lng: -3.70414,
      address: 'Calle Gran Vía, 34, 28013 Madrid, España',
    },
  })
  console.log(`✅ Updated Zara Gran Via: ${granVia.count} location(s)`)

  // Update Zara Castellana
  const castellana = await prisma.location.updateMany({
    where: { name: 'Zara Castellana' },
    data: {
      lat: 40.4475,
      lng: -3.6927,
      address: 'Paseo de la Castellana, 79, 28046 Madrid, España',
    },
  })
  console.log(`✅ Updated Zara Castellana: ${castellana.count} location(s)`)

  // Update Zara Serrano
  const serrano = await prisma.location.updateMany({
    where: { name: 'Zara Serrano' },
    data: {
      lat: 40.424864,
      lng: -3.683851,
      address: 'Calle Serrano, 92, 28006 Madrid, España',
    },
  })
  console.log(`✅ Updated Zara Serrano: ${serrano.count} location(s)`)

  console.log('✅ All location coordinates updated successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error updating coordinates:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
