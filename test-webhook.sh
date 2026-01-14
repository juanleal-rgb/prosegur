#!/bin/bash

# Comando para enviar un incidente al webhook
# Asegúrate de que la ubicación "Zara Serrano" exista en la base de datos

curl -X POST https://prosegur-production.up.railway.app/api/webhook/incident \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Se recibió un reporte de incendio de severidad media por la informante Zara Serrano; se notificaron de inmediato los servicios de emergencia y se iniciaron acciones iniciales de contención y evaluación en el lugar.",
    "category": "Incendio",
    "severity": "Medium",
    "html_report": "<html>\n  <body style=\"font-family: sans-serif; margin:20px;\">\n    <h2>Informe de Incidencia: Incendio</h2>\n    <table style=\"border-collapse: collapse; width:100%; max-width:700px;\">\n      <tr>\n        <th style=\"text-align:left; border:1px solid #000; padding:8px;\">Fecha</th>\n        <th style=\"text-align:left; border:1px solid #000; padding:8px;\">Ubicación</th>\n        <th style=\"text-align:left; border:1px solid #000; padding:8px;\">Severidad</th>\n      </tr>\n      <tr>\n        <td style=\"border:1px solid #000; padding:8px;\">14/01/2026</td>\n        <td style=\"border:1px solid #000; padding:8px;\">No especificada (reportada por Zara Serrano)</td>\n        <td style=\"border:1px solid #000; padding:8px;\">Media (Medium)</td>\n      </tr>\n    </table>\n    <p style=\"margin-top:16px; line-height:1.4;\">\n      Descripción: Se recibió un reporte de incendio informado por Zara Serrano, clasificado como de severidad media. Tras la recepción del aviso se procedió a notificar de inmediato a los servicios de emergencia y a activar medidas iniciales de contención y evaluación del área afectada. Durante la intervención se identificaron condiciones de riesgo moderado; se coordinó la asignación de recursos para control y remediación y se documentaron observaciones preliminares. Se recomienda realizar seguimiento operativo, registro detallado de daños y elaborar un informe técnico complementario.\n    </p>\n  </body>\n</html>",
    "location_name": "Zara Serrano"
  }'
