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
  console.log('[HTML Report Generation] Step 1: Starting HTML generation')
  console.log('[HTML Report Generation] Input text length:', reportText.length)
  console.log('[HTML Report Generation] Location:', locationName)
  console.log('[HTML Report Generation] Severity:', severity)
  console.log('[HTML Report Generation] Summary length:', summary.length)

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  console.log('[HTML Report Generation] Step 2: Generated date:', currentDate)

  const severityClass = `severity-${severity.toLowerCase()}`
  const severityLabel = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  }[severity.toLowerCase()] || severity
  console.log('[HTML Report Generation] Step 3: Severity class:', severityClass, 'Label:', severityLabel)

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
    console.log('[HTML Report Generation] Step 4: Formatting text, splitting by paragraphs')
    const paragraphs = text.split('\n\n')
    console.log('[HTML Report Generation] Found', paragraphs.length, 'paragraphs')
    
    const formatted = paragraphs
      .map((paragraph, index) => {
        if (paragraph.trim()) {
          const escapedParagraph = escapeHtml(paragraph.trim())
          const result = `<p style="margin: 0 0 12px 0; line-height: 1.6;">${escapedParagraph.replace(/\n/g, '<br>')}</p>`
          console.log(`[HTML Report Generation] Paragraph ${index + 1} formatted, length:`, result.length)
          return result
        }
        return ''
      })
      .join('')
    
    console.log('[HTML Report Generation] Total formatted text length:', formatted.length)
    return formatted
  }

  const formattedReport = formatText(reportText)
  console.log('[HTML Report Generation] Step 5: Text formatting complete')

  console.log('[HTML Report Generation] Step 6: Building complete HTML structure')
  const htmlOutput = `<!DOCTYPE html>
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
  
  console.log('[HTML Report Generation] Step 7: HTML generation complete')
  console.log('[HTML Report Generation] Final HTML length:', htmlOutput.length)
  console.log('[HTML Report Generation] HTML preview (first 200 chars):', htmlOutput.substring(0, 200))
  
  return htmlOutput
}

export async function POST(request: NextRequest) {
  console.log('[Webhook] ========== NEW INCIDENT REQUEST RECEIVED ==========')
  try {
    const body = await request.json()
    console.log('[Webhook] Step 1: Request body received')
    console.log('[Webhook] Body keys:', Object.keys(body))
    
    const { location_name, severity, category, summary, html_report } = body
    
    console.log('[Webhook] Step 2: Extracted fields:')
    console.log('[Webhook] - location_name:', location_name)
    console.log('[Webhook] - severity:', severity)
    console.log('[Webhook] - category:', category)
    console.log('[Webhook] - summary length:', summary?.length || 0)
    console.log('[Webhook] - html_report type:', typeof html_report)
    console.log('[Webhook] - html_report length:', html_report?.length || 0)
    console.log('[Webhook] - html_report preview (first 100 chars):', html_report?.substring(0, 100))

    // Validate required fields
    if (!location_name || !severity || !summary || !html_report) {
      console.log('[Webhook] ERROR: Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    console.log('[Webhook] Step 3: Validation passed')

    // Find location by name
    console.log('[Webhook] Step 4: Looking up location in database')
    const location = await prisma.location.findFirst({
      where: {
        name: location_name,
      },
    })

    if (!location) {
      console.log('[Webhook] ERROR: Location not found:', location_name)
      return NextResponse.json(
        { error: `Location "${location_name}" not found` },
        { status: 404 }
      )
    }
    console.log('[Webhook] Location found:', location.id, location.name)

    // Generate HTML from text report
    console.log('[Webhook] Step 5: Calling generateHTMLReport function')
    const htmlReport = generateHTMLReport(
      html_report, // Ahora es texto plano, no HTML
      location_name,
      severity,
      summary
    )
    console.log('[Webhook] Step 6: HTML report generated, length:', htmlReport.length)
    console.log('[Webhook] HTML report preview (first 300 chars):', htmlReport.substring(0, 300))

    // Create incident
    console.log('[Webhook] Step 7: Saving incident to database')
    console.log('[Webhook] Incident data:', {
      summaryLength: summary.length,
      severity,
      htmlReportLength: htmlReport.length,
      locationId: location.id
    })
    
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
    
    console.log('[Webhook] Step 8: Incident saved successfully')
    console.log('[Webhook] Incident ID:', incident.id)
    console.log('[Webhook] Incident createdAt:', incident.createdAt)
    console.log('[Webhook] Incident htmlReport length in DB:', incident.htmlReport.length)
    console.log('[Webhook] ========== INCIDENT CREATED SUCCESSFULLY ==========')

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
