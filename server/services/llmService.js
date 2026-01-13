const OpenAI = require('openai');
const puppeteer = require('puppeteer');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

// Generate summary of incidents using LLM
async function generateSummary(incidents) {
  const incidentsText = incidents.map((inc, idx) => {
    return `Incident ${idx + 1}:
- Location: ${inc.location_name}
- Date: ${inc.timestamp}
- Cause: ${inc.cause || 'Not specified'}
- Description: ${inc.description || 'No description'}
- Severity: ${inc.severity || 'Unknown'}`;
  }).join('\n\n');

  const prompt = `Analyze the following security incidents and provide a comprehensive summary in Spanish. Include:
1. Total number of incidents
2. Most common causes
3. Locations with most incidents
4. Severity patterns
5. Recommendations for improvement

Incidents:
${incidentsText}

Provide a clear, professional summary in Spanish:`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a security analyst providing incident reports in Spanish.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback summary if API fails
    return generateFallbackSummary(incidents);
  }
}

// Generate PDF report HTML using LLM, then convert to PDF
async function generatePDFReport(incidents, template = 'default') {
  const incidentsData = incidents.map(inc => ({
    location: inc.location_name,
    date: inc.timestamp,
    cause: inc.cause || 'No especificado',
    description: inc.description || 'Sin descripción',
    severity: inc.severity || 'Desconocida'
  }));

  const templatePrompt = `Generate a professional HTML report in Spanish for security incidents. Use this template structure:

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Informe de Incidencias</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #2c3e50; }
    .header { border-bottom: 2px solid #3498db; padding-bottom: 20px; margin-bottom: 30px; }
    .summary { background: #ecf0f1; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #bdc3c7; padding: 12px; text-align: left; }
    th { background-color: #3498db; color: white; }
    .severity-high { background-color: #e74c3c; color: white; }
    .severity-medium { background-color: #f39c12; color: white; }
    .severity-low { background-color: #27ae60; color: white; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Informe de Incidencias de Seguridad</h1>
    <p>Generado el: [FECHA_ACTUAL]</p>
  </div>
  
  <div class="summary">
    [RESUMEN_GENERADO_POR_LLM]
  </div>
  
  <h2>Detalle de Incidencias</h2>
  <table>
    <thead>
      <tr>
        <th>Ubicación</th>
        <th>Fecha</th>
        <th>Causa</th>
        <th>Descripción</th>
        <th>Severidad</th>
      </tr>
    </thead>
    <tbody>
      [TABLA_INCIDENCIAS]
    </tbody>
  </table>
</body>
</html>

Incidents data:
${JSON.stringify(incidentsData, null, 2)}

Generate the complete HTML with:
1. Current date in [FECHA_ACTUAL]
2. A comprehensive summary in [RESUMEN_GENERADO_POR_LLM] analyzing patterns, trends, and recommendations
3. A complete table in [TABLA_INCIDENCIAS] with all incidents, using severity classes for styling
4. Professional formatting and styling

Return ONLY the complete HTML code, no markdown, no explanations:`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a technical assistant that generates HTML reports. Always return only valid HTML code.' },
        { role: 'user', content: templatePrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    let htmlContent = completion.choices[0].message.content;
    
    // Clean up if LLM wrapped in markdown
    htmlContent = htmlContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Replace placeholders with actual data
    const currentDate = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    htmlContent = htmlContent.replace('[FECHA_ACTUAL]', currentDate);
    
    // Generate table rows
    const tableRows = incidentsData.map(inc => {
      const severityClass = `severity-${inc.severity?.toLowerCase() || 'medium'}`;
      return `<tr>
        <td>${inc.location}</td>
        <td>${new Date(inc.date).toLocaleDateString('es-ES')}</td>
        <td>${inc.cause}</td>
        <td>${inc.description}</td>
        <td class="${severityClass}">${inc.severity}</td>
      </tr>`;
    }).join('\n');
    
    htmlContent = htmlContent.replace('[TABLA_INCIDENCIAS]', tableRows);
    
    // Convert HTML to PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
    });
    await browser.close();
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
}

// Fallback summary if LLM fails
function generateFallbackSummary(incidents) {
  const total = incidents.length;
  const byLocation = {};
  const bySeverity = {};
  const causes = [];
  
  incidents.forEach(inc => {
    byLocation[inc.location_name] = (byLocation[inc.location_name] || 0) + 1;
    bySeverity[inc.severity] = (bySeverity[inc.severity] || 0) + 1;
    if (inc.cause) causes.push(inc.cause);
  });
  
  const topLocation = Object.entries(byLocation)
    .sort((a, b) => b[1] - a[1])[0];
  
  return `Resumen de Incidencias:
- Total de incidencias: ${total}
- Ubicación con más incidencias: ${topLocation ? `${topLocation[0]} (${topLocation[1]})` : 'N/A'}
- Distribución por severidad: ${JSON.stringify(bySeverity)}
- Causas reportadas: ${causes.length > 0 ? causes.slice(0, 5).join(', ') : 'No especificadas'}`;
}

module.exports = {
  generateSummary,
  generatePDFReport
};
