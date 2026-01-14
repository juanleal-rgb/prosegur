import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Genera HTML profesional a partir de texto plano para el reporte del incidente
 */
function generateHTMLReport(
  reportText: string,
  locationName: string,
  severity: string,
  summary: string
): string {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const severityClass = `severity-${severity.toLowerCase()}`
  const severityLabel = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  }[severity.toLowerCase()] || severity

  // Escapar HTML en el texto del reporte para evitar inyección
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  // Convertir saltos de línea a <p> o <br>
  const formatText = (text: string) => {
    return text
      .split('\n\n')
      .map((paragraph) => {
        if (paragraph.trim()) {
          const escapedParagraph = escapeHtml(paragraph.trim())
          return `<p style="margin: 0 0 12px 0; line-height: 1.6;">${escapedParagraph.replace(/\n/g, '<br>')}</p>`
        }
        return ''
      })
      .join('')
  }

  const formattedReport = formatText(reportText)

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Informe de Incidencia - ${escapeHtml(locationName)}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 0;
      padding: 40px;
      background-color: #ffffff;
      color: #2c3e50;
      line-height: 1.6;
    }
    .header { 
      border-bottom: 2px solid #3498db; 
      padding-bottom: 20px; 
      margin-bottom: 30px; 
    }
    h1 { 
      color: #2c3e50; 
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .date {
      color: #7f8c8d;
      font-size: 14px;
      margin: 0;
    }
    .summary { 
      background: #ecf0f1; 
      padding: 20px; 
      border-radius: 5px; 
      margin-bottom: 30px;
      border-left: 4px solid #3498db;
    }
    .summary h2 {
      margin-top: 0;
      color: #2c3e50;
      font-size: 20px;
    }
    .report-content {
      margin-bottom: 30px;
    }
    .report-content h2 {
      color: #2c3e50;
      font-size: 22px;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 1px solid #ecf0f1;
      padding-bottom: 10px;
    }
    .report-content p {
      margin: 0 0 12px 0;
      line-height: 1.6;
      color: #34495e;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 20px;
      margin-bottom: 20px;
    }
    th, td { 
      border: 1px solid #bdc3c7; 
      padding: 12px; 
      text-align: left; 
    }
    th { 
      background-color: #3498db; 
      color: white;
      font-weight: 600;
    }
    td {
      background-color: #ffffff;
    }
    .severity-high { 
      background-color: #e74c3c !important; 
      color: white !important;
      font-weight: 600;
    }
    .severity-medium { 
      background-color: #f39c12 !important; 
      color: white !important;
      font-weight: 600;
    }
    .severity-low { 
      background-color: #27ae60 !important; 
      color: white !important;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ecf0f1;
      color: #7f8c8d;
      font-size: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Informe de Incidencia de Seguridad</h1>
    <p class="date">Generado el: ${currentDate}</p>
  </div>
  
  <div class="summary">
    <h2>Resumen</h2>
    <p>${escapeHtml(summary)}</p>
  </div>
  
  <div class="report-content">
    <h2>Detalle del Incidente</h2>
    ${formattedReport}
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Ubicación</th>
        <th>Fecha</th>
        <th>Severidad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${escapeHtml(locationName)}</td>
        <td>${currentDate}</td>
        <td class="${severityClass}">${escapeHtml(severityLabel)}</td>
      </tr>
    </tbody>
  </table>
  
  <div class="footer">
    <p>Este informe fue generado automáticamente por el sistema de gestión de incidentes.</p>
  </div>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { location_name, severity, category, summary, html_report } = body

    // Validate required fields
    if (!location_name || !severity || !summary || !html_report) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find location by name
    const location = await prisma.location.findFirst({
      where: {
        name: location_name,
      },
    })

    if (!location) {
      return NextResponse.json(
        { error: `Location "${location_name}" not found` },
        { status: 404 }
      )
    }

    // Generate HTML from text report
    const htmlReport = generateHTMLReport(
      html_report, // Ahora es texto plano, no HTML
      location_name,
      severity,
      summary
    )

    // Create incident
    const incident = await prisma.incident.create({
      data: {
        summary,
        severity,
        htmlReport: htmlReport,
        locationId: location.id,
      },
      include: {
        location: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        incident: {
          id: incident.id,
          createdAt: incident.createdAt,
          summary: incident.summary,
          severity: incident.severity,
          location: {
            name: incident.location.name,
            address: incident.location.address,
          },
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
