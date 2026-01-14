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
- `html_report` (string): Reporte completo en formato **texto plano** (el sistema genera el HTML automáticamente)

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
  "html_report": "Se detectó un robo de mercancía de alto valor en la sección de accesorios de la tienda Zara Gran Via. El incidente fue capturado por las cámaras de seguridad y se activó inmediatamente el protocolo de seguridad.\n\nEl sospechoso fue identificado y se notificó a las autoridades competentes. Se procedió a revisar las grabaciones de las cámaras de seguridad para obtener más información sobre el incidente.\n\nRecomendaciones:\n- Revisar los protocolos de seguridad en la sección de accesorios\n- Aumentar la presencia de personal de seguridad durante horas pico\n- Considerar la instalación de sistemas anti-robo adicionales"
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
    "html_report": "Se detectó un robo de mercancía de alto valor en la sección de accesorios. El incidente fue capturado por las cámaras de seguridad.\n\nRecomendaciones:\n- Revisar protocolos de seguridad\n- Aumentar presencia de personal"
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
  "html_report": "Se recibió un reporte de incendio relacionado con la referencia Zara Serrano; la situación fue evaluada y clasificada como de severidad media.\n\nSe procedió a activar el protocolo de emergencia, notificando a los servicios de extinción y, en su caso, a los servicios médicos y de seguridad pertinentes. Se llevaron a cabo acciones iniciales de contención y evacuación según protocolos disponibles.\n\nRecomendaciones:\n- Realizar inspección técnica detallada del lugar\n- Determinar causas del incidente\n- Aplicar medidas preventivas para evitar recurrencias"
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
  "html_report": "Alarma de seguridad activada por movimiento no autorizado. Se revisaron las cámaras y se confirmó falsa alarma.\n\nSistema funcionando correctamente. No se requieren acciones adicionales."
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
      html_report: 'Se detectó un incidente de seguridad. El sistema fue activado correctamente.\n\nDetalles del incidente y recomendaciones adicionales.'
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
        "html_report": """Se detectó un incidente de seguridad. El sistema fue activado correctamente.

Detalles del incidente y recomendaciones adicionales."""
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

1. **HTML Report:** El campo `html_report` debe contener **texto plano** (no HTML). El sistema genera automáticamente el HTML formateado con estilos profesionales. Puedes usar saltos de línea (`\n`) para separar párrafos.

2. **Severidad:** Los valores deben ser exactamente `"Low"`, `"Medium"`, o `"High"` (con mayúscula inicial).

3. **Location Name:** Debe coincidir exactamente con una ubicación existente en la base de datos.

4. **Timestamps:** El campo `createdAt` se genera automáticamente en el servidor.
