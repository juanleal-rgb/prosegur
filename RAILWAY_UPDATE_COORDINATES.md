# 🚂 Actualizar Coordenadas en Railway

## ✅ Opción 1: Usar la Terminal del Dashboard de Railway (MÁS FÁCIL - Recomendado)

1. Ve a tu proyecto en [railway.app](https://railway.app)
2. Click en tu **servicio web** (no la base de datos)
3. Busca la pestaña **"Deployments"** o **"Settings"**
4. Busca el botón **"Open Shell"** o **"Terminal"** (puede estar en el menú de tres puntos)
5. En la terminal que se abre, ejecuta:
   ```bash
   npm run db:update-coordinates
   ```

   O directamente:
   ```bash
   npx tsx scripts/update-location-coordinates.ts
   ```

## Opción 2: Ejecutar directamente con npx (desde tu máquina local)

En la terminal de Railway, ejecuta:
```bash
npx tsx scripts/update-location-coordinates.ts
```

## ⚠️ Importante

- **Solo necesitas ejecutarlo UNA VEZ** después de hacer commit y push
- El commit y push actualiza el código, pero NO actualiza los datos existentes en la base de datos
- Este script actualiza las coordenadas de las ubicaciones existentes sin borrar incidentes

## ✅ Verificación

Después de ejecutar el script, verifica que las coordenadas se actualizaron:
- Abre tu aplicación en Railway
- Verifica que las tiendas aparezcan en las nuevas ubicaciones en el mapa
