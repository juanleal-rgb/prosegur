import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Endpoint para agregar incidentes de ejemplo sin borrar los existentes
// Útil cuando no tienes acceso a la terminal de Railway
export async function POST(request: NextRequest) {
  try {
    // Opcional: agregar autenticación aquí si lo necesitas
    // const authHeader = request.headers.get('authorization')
    // if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const exampleIncidents = [
      {
        locationName: 'Zara Serrano',
        summary: 'Incendio reportado asociado a Zara Serrano, clasificado con severidad media; se activó el protocolo de emergencia, se notificaron los servicios correspondientes y la incidencia fue documentada para seguimiento e investigación.',
        severity: 'Medium' as const,
        htmlReport: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #ffffff; color: #000000;">
  <h2 style="color: #000000; font-size: 24px; margin-bottom: 16px; font-weight: bold;">Informe de Incidencia: Incendio</h2>
  <table style="width:100%; border-collapse: collapse; margin-bottom: 16px; border: 1px solid #000000;">
    <thead>
      <tr style="background-color: #f0f0f0;">
        <th style="border: 1px solid #000000; padding: 10px; text-align: left; color: #000000; font-weight: bold;">Fecha</th>
        <th style="border: 1px solid #000000; padding: 10px; text-align: left; color: #000000; font-weight: bold;">Ubicación</th>
        <th style="border: 1px solid #000000; padding: 10px; text-align: left; color: #000000; font-weight: bold;">Severidad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #000000; padding: 10px; color: #000000;">${new Date().toISOString().split('T')[0]}</td>
        <td style="border: 1px solid #000000; padding: 10px; color: #000000;">Asociada a Zara Serrano</td>
        <td style="border: 1px solid #000000; padding: 10px; color: #000000;">Media</td>
      </tr>
    </tbody>
  </table>

  <p style="margin: 16px 0; line-height: 1.6; color: #000000; font-size: 14px;">
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
        severity: 'Low' as const,
        htmlReport: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #ffffff; color: #000000;">
  <h2 style="color: #000000; font-size: 24px; margin-bottom: 16px; font-weight: bold;">Informe de Incidencia: Alarma de Seguridad</h2>
  <table style="width:100%; border-collapse: collapse; margin-bottom: 16px; border: 1px solid #000000;">
    <thead>
      <tr style="background-color: #f0f0f0;">
        <th style="border: 1px solid #000000; padding: 10px; text-align: left; color: #000000; font-weight: bold;">Fecha</th>
        <th style="border: 1px solid #000000; padding: 10px; text-align: left; color: #000000; font-weight: bold;">Ubicación</th>
        <th style="border: 1px solid #000000; padding: 10px; text-align: left; color: #000000; font-weight: bold;">Severidad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #000000; padding: 10px; color: #000000;">${new Date().toISOString().split('T')[0]}</td>
        <td style="border: 1px solid #000000; padding: 10px; color: #000000;">Zara Gran Via</td>
        <td style="border: 1px solid #000000; padding: 10px; color: #000000;">Baja</td>
      </tr>
    </tbody>
  </table>

  <p style="margin: 16px 0; line-height: 1.6; color: #000000; font-size: 14px;">
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
        severity: 'Medium' as const,
        htmlReport: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #ffffff; color: #000000;">
  <h2 style="color: #000000; font-size: 24px; margin-bottom: 16px; font-weight: bold;">Informe de Incidencia: Avería en Climatización</h2>
  <table style="width:100%; border-collapse: collapse; margin-bottom: 16px; border: 1px solid #000000;">
    <thead>
      <tr style="background-color: #f0f0f0;">
        <th style="border: 1px solid #000000; padding: 10px; text-align: left; color: #000000; font-weight: bold;">Fecha</th>
        <th style="border: 1px solid #000000; padding: 10px; text-align: left; color: #000000; font-weight: bold;">Ubicación</th>
        <th style="border: 1px solid #000000; padding: 10px; text-align: left; color: #000000; font-weight: bold;">Severidad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #000000; padding: 10px; color: #000000;">${new Date().toISOString().split('T')[0]}</td>
        <td style="border: 1px solid #000000; padding: 10px; color: #000000;">Zara Castellana</td>
        <td style="border: 1px solid #000000; padding: 10px; color: #000000;">Media</td>
      </tr>
    </tbody>
  </table>

  <p style="margin: 16px 0; line-height: 1.6; color: #000000; font-size: 14px;">
    Se detectó una avería en el sistema de climatización de Zara Castellana, con temperaturas elevadas en el interior del establecimiento.
    Se activó el protocolo de mantenimiento y se contactó inmediatamente con el servicio técnico autorizado.
    Se implementaron medidas temporales para mantener condiciones aceptables mientras se realiza la reparación.
    Se recomienda realizar mantenimiento preventivo del sistema de climatización para evitar futuras averías.
  </p>
</div>`,
      },
    ]

    const results = {
      success: 0,
      errors: 0,
      created: [] as any[],
      errorsList: [] as string[],
    }

    for (const incident of exampleIncidents) {
      try {
        const location = await prisma.location.findFirst({
          where: { name: incident.locationName },
        })

        if (!location) {
          results.errors++
          results.errorsList.push(`Ubicación "${incident.locationName}" no encontrada`)
          continue
        }

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

        results.success++
        results.created.push({
          id: created.id,
          summary: created.summary.substring(0, 50) + '...',
          location: created.location.name,
          severity: created.severity,
        })
      } catch (error: any) {
        results.errors++
        results.errorsList.push(`Error al crear incidente: ${error.message}`)
      }
    }

    return NextResponse.json(
      {
        message: `Proceso completado: ${results.success} creados, ${results.errors} errores`,
        results,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error adding incidents:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
