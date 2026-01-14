import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Array de incidentes de ejemplo que puedes modificar y agregar
const exampleIncidents = [
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
    summary: 'Alarma de seguridad activada por movimiento no autorizado. Se revisaron las cámaras y se confirmó falsa alarma. Sistema funcionando correctamente.',
    severity: 'Low',
    htmlReport: `<div style="font-family: sans-serif; padding: 16px;">
  <h2>Informe de Incidencia: Alarma de Seguridad</h2>
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
        <td style="border: 1px solid #ccc; padding: 8px;">Baja</td>
      </tr>
    </tbody>
  </table>

  <p style="margin: 0; line-height: 1.4;">
    Se activó la alarma de seguridad por detección de movimiento no autorizado en Zara Gran Via.
    Se revisaron inmediatamente las grabaciones de las cámaras de seguridad y se confirmó que se trataba de una falsa alarma.
    El sistema de seguridad está funcionando correctamente. No se detectaron intrusiones ni actividades sospechosas.
    Se recomienda revisar la sensibilidad del sensor para evitar falsas alarmas futuras.
  </p>
</div>`,
  },
  {
    locationName: 'Zara Castellana',
    summary: 'Avería en sistema de climatización. Temperatura elevada detectada. Se activó protocolo de mantenimiento y se contactó con servicio técnico.',
    severity: 'Medium',
    htmlReport: `<div style="font-family: sans-serif; padding: 16px;">
  <h2>Informe de Incidencia: Avería en Climatización</h2>
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
        <td style="border: 1px solid #ccc; padding: 8px;">Media</td>
      </tr>
    </tbody>
  </table>

  <p style="margin: 0; line-height: 1.4;">
    Se detectó una avería en el sistema de climatización de Zara Castellana, con temperaturas elevadas en el interior del establecimiento.
    Se activó el protocolo de mantenimiento y se contactó inmediatamente con el servicio técnico autorizado.
    Se implementaron medidas temporales para mantener condiciones aceptables mientras se realiza la reparación.
    Se recomienda realizar mantenimiento preventivo del sistema de climatización para evitar futuras averías.
  </p>
</div>`,
  },
]

async function main() {
  console.log('📝 Agregando incidentes de ejemplo...\n')

  let successCount = 0
  let errorCount = 0

  for (const incident of exampleIncidents) {
    try {
      // Buscar la ubicación por nombre
      const location = await prisma.location.findFirst({
        where: {
          name: incident.locationName,
        },
      })

      if (!location) {
        console.error(`❌ Ubicación "${incident.locationName}" no encontrada`)
        errorCount++
        continue
      }

      // Crear el incidente
      const created = await prisma.incident.create({
        data: {
          summary: incident.summary,
          severity: incident.severity,
          htmlReport: incident.htmlReport,
          locationId: location.id,
        },
        include: {
          location: true,
        },
      })

      console.log(`✅ Incidente creado: ${incident.summary.substring(0, 50)}...`)
      console.log(`   Ubicación: ${created.location.name}`)
      console.log(`   Severidad: ${created.severity}\n`)
      successCount++
    } catch (error) {
      console.error(`❌ Error al crear incidente: ${error}`)
      errorCount++
    }
  }

  console.log(`\n📊 Resumen:`)
  console.log(`   ✅ Creados: ${successCount}`)
  console.log(`   ❌ Errores: ${errorCount}`)
}

main()
  .catch((e) => {
    console.error('Error fatal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
