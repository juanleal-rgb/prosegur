-- Script para borrar todas las ubicaciones (y sus incidentes relacionados)
-- Esto hará que el seed se ejecute automáticamente con las nuevas coordenadas

-- Opción 1: Borrar solo las ubicaciones (los incidentes se borrarán automáticamente por CASCADE)
DELETE FROM "Location";

-- Opción 2: Si quieres borrar todo (ubicaciones e incidentes)
-- DELETE FROM "Incident";
-- DELETE FROM "Location";

-- Verificar que se borraron
SELECT COUNT(*) as location_count FROM "Location";
SELECT COUNT(*) as incident_count FROM "Incident";
