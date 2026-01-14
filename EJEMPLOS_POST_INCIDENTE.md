# 📝 Ejemplos de POST para Crear Incidentes

## 🔗 Endpoint

```
POST /api/webhook/incident
```

**URL completa (local):** `http://localhost:3000/api/webhook/incident`  
**URL completa (producción):** `https://tu-proyecto.railway.app/api/webhook/incident`

---

## 📋 Campos Requeridos

- `location_name` (string): Nombre exacto de la ubicación (debe existir en la BD)
- `severity` (string): "Low", "Medium", o "High"
- `summary` (string): Resumen corto del incidente
- `html_report` (string): Reporte completo en formato HTML

## 📋 Campos Opcionales

- `category` (string): Categoría del incidente (no se guarda actualmente)

---

## ✅ Ejemplo 1: Incidente de Alta Severidad (Robo)

### JSON Payload

```json
{
  "location_name": "Zara Gran Via",
  "severity": "High",
  "category": "Theft",
  "summary": "Robo de mercancía de alto valor en la sección de accesorios. El sospechoso fue detectado por las cámaras de seguridad.",
  "html_report": "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Informe de Incidencia</title><style>body { font-family: Arial, sans-serif; margin: 40px; } h1 { color: #2c3e50; } .header { border-bottom: 2px solid #3498db; padding-bottom: 20px; margin-bottom: 30px; } .summary { background: #ecf0f1; padding: 20px; border-radius: 5px; margin-bottom: 30px; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #bdc3c7; padding: 12px; text-align: left; } th { background-color: #3498db; color: white; } .severity-high { background-color: #e74c3c; color: white; }</style></head><body><div class=\"header\"><h1>Informe de Incidencias de Seguridad</h1><p>Generado el: 14 de enero de 2026</p></div><div class=\"summary\"><h2>Resumen Ejecutivo</h2><p>Se detectó un robo de mercancía de alto valor en la sección de accesorios de la tienda Zara Gran Via. El incidente fue capturado por las cámaras de seguridad y se activó inmediatamente el protocolo de seguridad.</p></div><h2>Detalle de Incidencias</h2><table><thead><tr><th>Ubicación</th><th>Fecha</th><th>Causa</th><th>Descripción</th><th>Severidad</th></tr></thead><tbody><tr><td>Zara Gran Via</td><td>14/01/2026</td><td>Robo</td><td>Robo de mercancía de alto valor en la sección de accesorios.</td><td class=\"severity-high\">High</td></tr></tbody></table></body></html>"
}
```

### cURL

```bash
curl -X POST http://localhost:3000/api/webhook/incident \
  -H "Content-Type: application/json" \
  -d '{
    "location_name": "Zara Gran Via",
    "severity": "High",
    "category": "Theft",
    "summary": "Robo de mercancía de alto valor en la sección de accesorios. El sospechoso fue detectado por las cámaras de seguridad.",
    "html_report": "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Informe de Incidencia</title><style>body { font-family: Arial, sans-serif; margin: 40px; } h1 { color: #2c3e50; } .header { border-bottom: 2px solid #3498db; padding-bottom: 20px; margin-bottom: 30px; } .summary { background: #ecf0f1; padding: 20px; border-radius: 5px; margin-bottom: 30px; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #bdc3c7; padding: 12px; text-align: left; } th { background-color: #3498db; color: white; } .severity-high { background-color: #e74c3c; color: white; }</style></head><body><div class=\"header\"><h1>Informe de Incidencias de Seguridad</h1><p>Generado el: 14 de enero de 2026</p></div><div class=\"summary\"><h2>Resumen Ejecutivo</h2><p>Se detectó un robo de mercancía de alto valor en la sección de accesorios de la tienda Zara Gran Via. El incidente fue capturado por las cámaras de seguridad y se activó inmediatamente el protocolo de seguridad.</p></div><h2>Detalle de Incidencias</h2><table><thead><tr><th>Ubicación</th><th>Fecha</th><th>Causa</th><th>Descripción</th><th>Severidad</th></tr></thead><tbody><tr><td>Zara Gran Via</td><td>14/01/2026</td><td>Robo</td><td>Robo de mercancía de alto valor en la sección de accesorios.</td><td class=\"severity-high\">High</td></tr></tbody></table></body></html>"
  }'
```

---

## ✅ Ejemplo 2: Incidente de Severidad Media (Incendio)

### JSON Payload

```json
{
  "location_name": "Zara Serrano",
  "severity": "Medium",
  "category": "Fire",
  "summary": "Incendio reportado asociado a Zara Serrano, clasificado con severidad media; se activó el protocolo de emergencia.",
  "html_report": "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Informe de Incidencia</title><style>body { font-family: Arial, sans-serif; margin: 40px; } h1 { color: #2c3e50; } .header { border-bottom: 2px solid #3498db; padding-bottom: 20px; margin-bottom: 30px; } .summary { background: #ecf0f1; padding: 20px; border-radius: 5px; margin-bottom: 30px; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #bdc3c7; padding: 12px; text-align: left; } th { background-color: #3498db; color: white; } .severity-medium { background-color: #f39c12; color: white; }</style></head><body><div class=\"header\"><h1>Informe de Incidencias de Seguridad</h1><p>Generado el: 14 de enero de 2026</p></div><div class=\"summary\"><h2>Resumen Ejecutivo</h2><p>Se recibió un reporte de incendio relacionado con la referencia Zara Serrano; la situación fue evaluada y clasificada como de severidad media. Se procedió a activar el protocolo de emergencia, notificando a los servicios de extinción y, en su caso, a los servicios médicos y de seguridad pertinentes.</p></div><h2>Detalle de Incidencias</h2><table><thead><tr><th>Ubicación</th><th>Fecha</th><th>Causa</th><th>Descripción</th><th>Severidad</th></tr></thead><tbody><tr><td>Zara Serrano</td><td>14/01/2026</td><td>Incendio</td><td>Incendio reportado asociado a Zara Serrano, clasificado con severidad media; se activó el protocolo de emergencia.</td><td class=\"severity-medium\">Medium</td></tr></tbody></table></body></html>"
}
```

---

## ✅ Ejemplo 3: Incidente de Baja Severidad (Falsa Alarma)

### JSON Payload

```json
{
  "location_name": "Zara Castellana",
  "severity": "Low",
  "category": "False Alarm",
  "summary": "Alarma de seguridad activada por movimiento no autorizado. Se revisaron las cámaras y se confirmó falsa alarma. Sistema funcionando correctamente.",
  "html_report": "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Informe de Incidencia</title><style>body { font-family: Arial, sans-serif; margin: 40px; } h1 { color: #2c3e50; } .header { border-bottom: 2px solid #3498db; padding-bottom: 20px; margin-bottom: 30px; } .summary { background: #ecf0f1; padding: 20px; border-radius: 5px; margin-bottom: 30px; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #bdc3c7; padding: 12px; text-align: left; } th { background-color: #3498db; color: white; } .severity-low { background-color: #27ae60; color: white; }</style></head><body><div class=\"header\"><h1>Informe de Incidencias de Seguridad</h1><p>Generado el: 14 de enero de 2026</p></div><div class=\"summary\"><h2>Resumen Ejecutivo</h2><p>Alarma de seguridad activada por movimiento no autorizado. Se revisaron las cámaras y se confirmó falsa alarma. Sistema funcionando correctamente.</p></div><h2>Detalle de Incidencias</h2><table><thead><tr><th>Ubicación</th><th>Fecha</th><th>Causa</th><th>Descripción</th><th>Severidad</th></tr></thead><tbody><tr><td>Zara Castellana</td><td>14/01/2026</td><td>Falsa Alarma</td><td>Alarma de seguridad activada por movimiento no autorizado. Se revisaron las cámaras y se confirmó falsa alarma.</td><td class=\"severity-low\">Low</td></tr></tbody></table></body></html>"
}
```

---

## 💻 Ejemplos de Código

### JavaScript/Node.js

```javascript
async function crearIncidente() {
  const response = await fetch('http://localhost:3000/api/webhook/incident', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location_name: 'Zara Gran Via',
      severity: 'High',
      category: 'Theft',
      summary: 'Robo de mercancía de alto valor en la sección de accesorios.',
      html_report: '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Informe</title><style>body { font-family: Arial, sans-serif; margin: 40px; }</style></head><body><h1>Informe de Incidencia</h1><p>Detalles del incidente...</p></body></html>'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear incidente');
  }

  const data = await response.json();
  console.log('Incidente creado:', data);
  return data;
}

// Uso
crearIncidente().catch(console.error);
```

### Python

```python
import requests
import json

def crear_incidente():
    url = "http://localhost:3000/api/webhook/incident"
    
    payload = {
        "location_name": "Zara Gran Via",
        "severity": "High",
        "category": "Theft",
        "summary": "Robo de mercancía de alto valor en la sección de accesorios.",
        "html_report": """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Informe</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
    </style>
</head>
<body>
    <h1>Informe de Incidencia</h1>
    <p>Detalles del incidente...</p>
</body>
</html>"""
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code != 201:
        error = response.json()
        raise Exception(error.get("error", "Error al crear incidente"))
    
    return response.json()

# Uso
try:
    resultado = crear_incidente()
    print("Incidente creado:", resultado)
except Exception as e:
    print("Error:", e)
```

### Usando el archivo JSON

```bash
# Con cURL usando un archivo JSON
curl -X POST http://localhost:3000/api/webhook/incident \
  -H "Content-Type: application/json" \
  -d @ejemplo-post-incidente.json
```

---

## 📍 Ubicaciones Disponibles

Las siguientes ubicaciones deben existir en tu base de datos (se crean automáticamente con el seed):

- `"Zara Gran Via"`
- `"Zara Castellana"`
- `"Zara Serrano"`

**⚠️ Importante:** El `location_name` debe coincidir **exactamente** (case-sensitive) con el nombre en la base de datos.

---

## 🔍 Respuestas del Servidor

### ✅ Éxito (201 Created)

```json
{
  "success": true,
  "incident": {
    "id": "clx1234567890abcdef",
    "createdAt": "2026-01-14T12:30:00.000Z",
    "summary": "Robo de mercancía de alto valor...",
    "severity": "High",
    "location": {
      "name": "Zara Gran Via",
      "address": "Gran Vía, 16, 28013 Madrid, Spain"
    }
  }
}
```

### ❌ Error - Campos Faltantes (400 Bad Request)

```json
{
  "error": "Missing required fields"
}
```

### ❌ Error - Ubicación No Encontrada (404 Not Found)

```json
{
  "error": "Location \"Nombre Incorrecto\" not found"
}
```

---

## 🧪 Probar Localmente

1. Asegúrate de que el servidor esté corriendo:
   ```bash
   npm run dev
   ```

2. Ejecuta el POST usando cURL o cualquier cliente HTTP:
   ```bash
   curl -X POST http://localhost:3000/api/webhook/incident \
     -H "Content-Type: application/json" \
     -d @ejemplo-post-incidente.json
   ```

3. Verifica que el incidente aparezca en el dashboard en `http://localhost:3000`

---

## 📝 Notas Importantes

1. **HTML Report:** El campo `html_report` debe contener HTML válido. Este HTML se usa para generar PDFs cuando el usuario descarga el reporte.

2. **Severidad:** Los valores deben ser exactamente `"Low"`, `"Medium"`, o `"High"` (con mayúscula inicial).

3. **Location Name:** Debe coincidir exactamente con una ubicación existente en la base de datos.

4. **Timestamps:** El campo `createdAt` se genera automáticamente en el servidor.
