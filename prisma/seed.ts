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

  const createdLocations = []
  for (const location of locations) {
    const created = await prisma.location.create({
      data: location,
    })
    createdLocations.push(created)
  }

  // Create example incidents
  const incidents = [
    {
      locationName: 'Zara Serrano',
      summary: 'Incendio reportado asociado a Zara Serrano, clasificado con severidad media; se activó el protocolo de emergencia, se notificaron los servicios correspondientes y la incidencia fue documentada para seguimiento e investigación.',
      severity: 'Medium',
      htmlReport: `<div style="font-family: sans-serif; padding: 16px;">
  <h2>Informe de Incidencia: Incendio</h2>
  <table style="width:100%; border-collapse: collapse; margin-bottom: 12px;">
    <thead>
      <tr>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Fecha</th>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Ubicación</th>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Severidad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">${new Date().toISOString().split('T')[0]}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Asociada a Zara Serrano</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Media</td>
      </tr>
    </tbody>
  </table>

  <p style="margin: 0; line-height: 1.4;">
    Se recibió un reporte de incendio relacionado con la referencia Zara Serrano; la situación fue evaluada y clasificada como de severidad media.
    Se procedió a activar el protocolo de emergencia, notificando a los servicios de extinción y, en su caso, a los servicios médicos y de seguridad pertinentes.
    Se llevaron a cabo acciones iniciales de contención y evacuación según protocolos disponibles, y la incidencia fue registrada formalmente para investigación posterior y seguimiento de medidas correctivas.
    Se recomienda realizar inspección técnica detallada del lugar, determinar causas y aplicar medidas preventivas para evitar recurrencias.
  </p>
</div>`,
    },
    {
      locationName: 'Zara Gran Via',
      summary: 'Robo reportado en Zara Gran Via durante horario comercial. Se activó protocolo de seguridad, se notificó a la policía y se inició investigación.',
      severity: 'High',
      htmlReport: `<div style="font-family: sans-serif; padding: 16px;">
  <h2>Informe de Incidencia: Robo</h2>
  <table style="width:100%; border-collapse: collapse; margin-bottom: 12px;">
    <thead>
      <tr>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Fecha</th>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Ubicación</th>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Severidad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">${new Date().toISOString().split('T')[0]}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Zara Gran Via</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Alta</td>
      </tr>
    </tbody>
  </table>

  <p style="margin: 0; line-height: 1.4;">
    Se reportó un incidente de robo en las instalaciones de Zara Gran Via durante el horario comercial.
    Se activó inmediatamente el protocolo de seguridad, se notificó a las autoridades policiales y se inició una investigación interna.
    Se revisaron las grabaciones de seguridad y se documentó toda la información relevante para el seguimiento del caso.
    Se recomienda reforzar las medidas de seguridad y realizar una revisión de los protocolos de prevención.
  </p>
</div>`,
    },
    {
      locationName: 'Zara Castellana',
      summary: 'Fuga de agua detectada en el área de almacén. Se activó protocolo de mantenimiento, se controló la fuga y se programó reparación.',
      severity: 'Low',
      htmlReport: `<div style="font-family: sans-serif; padding: 16px;">
  <h2>Informe de Incidencia: Fuga de Agua</h2>
  <table style="width:100%; border-collapse: collapse; margin-bottom: 12px;">
    <thead>
      <tr>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Fecha</th>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Ubicación</th>
        <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Severidad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">${new Date().toISOString().split('T')[0]}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Zara Castellana</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Baja</td>
      </tr>
    </tbody>
  </table>

  <p style="margin: 0; line-height: 1.4;">
    Se detectó una fuga de agua en el área de almacén de Zara Castellana.
    Se activó el protocolo de mantenimiento, se controló la fuga de manera inmediata y se programó una reparación completa.
    No se reportaron daños significativos a la mercancía y las operaciones continuaron con normalidad.
    Se recomienda realizar una inspección preventiva del sistema de fontanería para evitar futuros incidentes.
  </p>
</div>`,
    },
  ]

  for (const incident of incidents) {
    const location = createdLocations.find(loc => loc.name === incident.locationName)
    if (location) {
      await prisma.incident.create({
        data: {
          summary: incident.summary,
          severity: incident.severity,
          htmlReport: incident.htmlReport,
          locationId: location.id,
        },
      })
    }
  }

  console.log('✅ Seed completed: Created 3 Zara locations and 3 example incidents in Madrid')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
