# 🗑️ Borrar Ubicaciones y Resetear en Railway

## Opción 1: Desde Railway Dashboard (Más Fácil)

1. Ve a [railway.app](https://railway.app) → Tu proyecto
2. Click en tu **servicio PostgreSQL** (la base de datos)
3. Click en **"Data"** o **"Query"** o **"SQL Editor"**
4. Ejecuta este SQL:
   ```sql
   DELETE FROM "Location";
   ```
5. Verifica que se borraron:
   ```sql
   SELECT COUNT(*) FROM "Location";
   ```
   (Debería devolver 0)

6. **Reinicia tu servicio web**:
   - Ve a tu servicio web (no la base de datos)
   - Click en **"Settings"** → **"Restart"** o busca el botón de reinicio
   - O simplemente haz un nuevo commit y push (cualquier cambio pequeño)

7. El seed se ejecutará automáticamente con las nuevas coordenadas ✅

## Opción 2: Usar Prisma Studio (Desde Railway Terminal)

1. En Railway, abre la terminal de tu servicio web
2. Ejecuta:
   ```bash
   npx prisma studio
   ```
3. Esto abrirá Prisma Studio (necesitarás hacer un túnel o usar Railway's port forwarding)
4. Borra las ubicaciones manualmente desde la interfaz

## Opción 3: Script SQL Directo

Si Railway tiene un editor SQL:

```sql
-- Borrar todas las ubicaciones (los incidentes se borrarán automáticamente)
DELETE FROM "Location";
```

## ⚠️ Importante

- **Los incidentes se borrarán automáticamente** porque tienen `onDelete: Cascade` en el schema
- Si quieres **mantener los incidentes**, primero actualiza sus `locationId` a NULL o elimínalos manualmente
- Después de borrar, el seed se ejecutará automáticamente en el próximo reinicio/despliegue

## ✅ Verificación

Después de reiniciar, verifica en los logs que el seed se ejecutó:
```
🌱 Database is empty, seeding with initial data...
✅ Seed completed
```

Y verifica que las nuevas coordenadas están:
- Zara Serrano: `40.424864, -3.683851`
