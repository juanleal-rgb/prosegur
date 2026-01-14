# 🔗 Formato del Webhook - Incident Tracking Dashboard

## 📍 Endpoint

```
POST https://tu-proyecto.railway.app/api/webhook/incident
```

**Content-Type:** `application/json`

---

## 📦 Formato del Payload (JSON)

### Campos Requeridos

```json
{
  "location_name": "string (requerido)",
  "severity": "string (requerido)",
  "summary": "string (requerido)",
  "html_report": "string (requerido)"
}
```

### Campos Opcionales

```json
{
  "category": "string (opcional - no se guarda actualmente)"
}
```

---

## 📋 Especificación Detallada

### `location_name` (Requerido)
- **Tipo:** String
- **Descripción:** Nombre exacto de la ubicación donde ocurrió el incidente
- **Ejemplo:** `"Zara Gran Via"`
- **Importante:** Debe coincidir exactamente con el nombre de una ubicación existente en la base de datos
- **Ubicaciones disponibles por defecto:**
  - `"Zara Gran Via"`
  - `"Zara Castellana"`
  - `"Zara Serrano"`

### `severity` (Requerido)
- **Tipo:** String
- **Valores permitidos:** `"Low"`, `"Medium"`, `"High"` (case-sensitive)
- **Descripción:** Nivel de severidad del incidente
- **Ejemplo:** `"High"`

### `summary` (Requerido)
- **Tipo:** String
- **Descripción:** Resumen corto del incidente (se muestra como "Resumencillo" en el dashboard)
- **Ejemplo:** `"Robo de mercancía en la sección de accesorios"`

### `html_report` (Requerido)
- **Tipo:** String (Texto plano)
- **Descripción:** Reporte completo del incidente en formato texto plano. El sistema generará automáticamente el HTML formateado para los PDFs.
- **Ejemplo:** `"Se detectó un robo de mercancía de alto valor. El incidente fue capturado por las cámaras de seguridad.\n\nRecomendaciones:\n- Revisar protocolos de seguridad\n- Aumentar presencia de personal"`
- **Nota:** Puedes usar saltos de línea (`\n`) para separar párrafos. Los párrafos separados por doble salto de línea se convertirán en párrafos HTML separados.

### `category` (Opcional)
- **Tipo:** String
- **Descripción:** Categoría del incidente (actualmente no se guarda en la base de datos, pero se acepta en el payload)
- **Ejemplo:** `"Theft"`, `"Vandalism"`, `"Security"`

---

## ✅ Ejemplo Completo

```json
{
  "location_name": "Zara Gran Via",
  "severity": "High",
  "category": "Theft",
  "summary": "Robo de mercancía de alto valor en la sección de accesorios. El sospechoso fue detectado por las cámaras de seguridad.",
  "html_report": "Se detectó un robo de mercancía de alto valor en la sección de accesorios de la tienda Zara Gran Via. El incidente fue capturado por las cámaras de seguridad y se activó inmediatamente el protocolo de seguridad.\n\nEl sospechoso fue identificado y se notificó a las autoridades competentes. Se procedió a revisar las grabaciones de las cámaras de seguridad para obtener más información sobre el incidente.\n\nRecomendaciones:\n- Revisar los protocolos de seguridad en la sección de accesorios\n- Aumentar la presencia de personal de seguridad durante horas pico\n- Considerar la instalación de sistemas anti-robo adicionales"
}
```

---

## 🔄 Respuesta del Webhook

### Éxito (201 Created)

```json
{
  "success": true,
  "incident": {
    "id": "clx1234567890abcdef",
    "createdAt": "2024-01-13T21:30:00.000Z",
    "summary": "Robo de mercancía de alto valor...",
    "severity": "High",
    "location": {
      "name": "Zara Gran Via",
      "address": "Gran Vía, 16, 28013 Madrid, Spain"
    }
  }
}
```

### Error - Campos Faltantes (400 Bad Request)

```json
{
  "error": "Missing required fields"
}
```

### Error - Ubicación No Encontrada (404 Not Found)

```json
{
  "error": "Location \"Nombre Incorrecto\" not found"
}
```

### Error - Error del Servidor (500 Internal Server Error)

```json
{
  "error": "Internal server error"
}
```

---

## 🧪 Ejemplo de Prueba con cURL

```bash
curl -X POST https://tu-proyecto.railway.app/api/webhook/incident \
  -H "Content-Type: application/json" \
  -d '{
    "location_name": "Zara Gran Via",
    "severity": "High",
    "category": "Theft",
    "summary": "Robo de mercancía de alto valor en la sección de accesorios",
    "html_report": "Se detectó un robo de mercancía de alto valor. El incidente fue capturado por las cámaras de seguridad.\n\nRecomendaciones:\n- Revisar protocolos de seguridad\n- Aumentar presencia de personal"
  }'
```

---

## 🔧 Integración con AI Voice Agent / Workflow

### Ejemplo en JavaScript/Node.js

```javascript
async function sendIncidentToWebhook(incidentData) {
  const response = await fetch('https://tu-proyecto.railway.app/api/webhook/incident', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location_name: incidentData.location, // Ej: "Zara Gran Via"
      severity: incidentData.severity,     // "Low", "Medium", o "High"
      category: incidentData.category,      // Opcional
      summary: incidentData.summary,        // Resumen corto
      html_report: incidentData.htmlReport // HTML completo
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send incident');
  }

  return await response.json();
}
```

### Ejemplo en Python

```python
import requests
import json

def send_incident_to_webhook(incident_data):
    url = "https://tu-proyecto.railway.app/api/webhook/incident"
    
    payload = {
        "location_name": incident_data["location"],  # Ej: "Zara Gran Via"
        "severity": incident_data["severity"],        # "Low", "Medium", o "High"
        "category": incident_data.get("category"),     # Opcional
        "summary": incident_data["summary"],          # Resumen corto
        "html_report": incident_data["html_report"]   # HTML completo
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code != 201:
        error = response.json()
        raise Exception(error.get("error", "Failed to send incident"))
    
    return response.json()
```

### Ejemplo en Make.com / Zapier

**URL:** `https://tu-proyecto.railway.app/api/webhook/incident`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "location_name": "{{location}}",
  "severity": "{{severity}}",
  "category": "{{category}}",
  "summary": "{{summary}}",
  "html_report": "{{html_report}}"
}
```

---

## 📝 Notas Importantes

1. **Nombres de Ubicación:** El `location_name` debe coincidir **exactamente** con el nombre en la base de datos (case-sensitive). Si la ubicación no existe, recibirás un error 404.

2. **Severidad:** Los valores deben ser exactamente `"Low"`, `"Medium"`, o `"High"` (con mayúscula inicial).

3. **HTML Report:** El campo `html_report` debe contener texto plano (no HTML). El sistema generará automáticamente el HTML formateado con estilos profesionales para los PDFs. Puedes usar saltos de línea (`\n`) para separar párrafos.

4. **Categoría:** El campo `category` se acepta pero actualmente no se guarda en la base de datos. Puedes incluirlo para futuras expansiones.

5. **Timestamps:** El timestamp (`createdAt`) se genera automáticamente en el servidor cuando se crea el incidente.

---

## 🎯 Flujo de Trabajo Recomendado

1. **AI Voice Agent detecta incidente**
2. **Extrae información:**
   - Ubicación (mapear a nombre exacto: "Zara Gran Via", "Zara Castellana", o "Zara Serrano")
   - Severidad (clasificar como "Low", "Medium", o "High")
   - Resumen (texto corto)
   - Reporte completo (generar HTML)
3. **Envía POST al webhook** con el formato especificado
4. **Verifica respuesta:** Si `success: true`, el incidente se guardó correctamente
5. **El dashboard se actualiza automáticamente** (el mapa refresca cada 30 segundos)

---

## 🔍 Validación en el Workflow

Antes de enviar, valida:

- ✅ `location_name` no está vacío
- ✅ `severity` es uno de: "Low", "Medium", "High"
- ✅ `summary` no está vacío
- ✅ `html_report` no está vacío
- ✅ `location_name` existe en la base de datos (o maneja el error 404)

---

## 📞 Soporte

Si tienes problemas con el webhook:

1. Verifica que la URL sea correcta
2. Verifica que el `Content-Type` sea `application/json`
3. Verifica que todos los campos requeridos estén presentes
4. Verifica que `location_name` coincida exactamente con una ubicación existente
5. Revisa los logs en Railway para ver errores del servidor

---

## 🚀 Próximos Pasos

Una vez configurado el webhook en tu workflow:

1. Prueba con un incidente de prueba
2. Verifica que aparezca en el dashboard
3. Verifica que el PDF se genere correctamente
4. Configura alertas/notificaciones si es necesario

¡Listo para integrar! 🎉
