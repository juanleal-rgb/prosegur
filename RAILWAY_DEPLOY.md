# 🚂 Guía de Despliegue en Railway

Esta guía te ayudará a desplegar el Incident Tracking Dashboard en Railway paso a paso.

## 📋 Prerrequisitos

1. Cuenta en [Railway](https://railway.app) (gratis)
2. Repositorio Git (GitHub, GitLab, o Bitbucket)
3. Tu código subido al repositorio

## 🚀 Pasos para Desplegar

### Paso 1: Preparar el Repositorio

Asegúrate de que tu código esté en un repositorio Git:

```bash
# Si aún no tienes un repositorio Git
git init
git add .
git commit -m "Initial commit: Incident Tracking Dashboard"
git branch -M main

# Conecta con tu repositorio remoto (GitHub, etc.)
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

### Paso 2: Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app) e inicia sesión
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"** (o tu proveedor de Git)
4. Autoriza Railway para acceder a tus repositorios
5. Selecciona el repositorio con tu proyecto

### Paso 3: Agregar Base de Datos PostgreSQL

1. En tu proyecto de Railway, click en **"+ New"**
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway creará automáticamente una base de datos PostgreSQL
4. **IMPORTANTE**: Railway automáticamente creará la variable de entorno `DATABASE_URL` - no necesitas hacer nada más

### Paso 4: Configurar el Servicio Web

1. Railway debería detectar automáticamente que es un proyecto Next.js
2. Si no lo detecta, asegúrate de que:
   - El `package.json` tiene el script `build` y `start`
   - El archivo `railway.json` está en la raíz (ya lo creamos)

### Paso 5: Configurar Variables de Entorno (si es necesario)

Railway automáticamente inyecta `DATABASE_URL` desde el servicio PostgreSQL.

**No necesitas configurar nada manualmente** - Railway lo hace automáticamente cuando conectas el servicio PostgreSQL.

### Paso 6: Migraciones y Seed (Automático) ✅

**🎉 ¡Buenas noticias!** Las migraciones y el seed se ejecutan **automáticamente** cuando la aplicación inicia.

El script `start` en `package.json` ejecuta:
1. `prisma db push` - Crea las tablas si no existen
2. `prisma seed` - Agrega datos iniciales si la base está vacía
3. `next start` - Inicia la aplicación

**No necesitas hacer nada manualmente** - todo se configura automáticamente en el primer despliegue.

**Nota:** Si quieres ejecutar los comandos manualmente (por ejemplo, para resetear la base de datos), puedes usar Railway CLI o la terminal del dashboard (ver sección de Troubleshooting).

### Paso 7: Verificar el Despliegue

1. Railway generará una URL automáticamente (algo como: `tu-proyecto.railway.app`)
2. Puedes verla en el dashboard de Railway
3. Click en la URL para abrir tu aplicación

## 🔧 Configuración Avanzada

### Dominio Personalizado

1. En Railway, ve a tu servicio
2. Click en **"Settings"** → **"Networking"**
3. Click en **"Generate Domain"** o agrega un dominio personalizado

### Variables de Entorno Adicionales

Si necesitas agregar más variables de entorno:

1. Ve a tu servicio en Railway
2. Click en **"Variables"**
3. Agrega las variables que necesites

### Monitoreo y Logs

- **Logs**: Click en tu servicio → **"Deployments"** → Selecciona un deployment → **"View Logs"**
- **Métricas**: Railway muestra automáticamente CPU, memoria y tráfico

## 🐛 Troubleshooting

### Error: "DATABASE_URL not found"

- Asegúrate de que el servicio PostgreSQL esté conectado al servicio web
- En Railway, ve a tu servicio web → **"Settings"** → **"Variables"**
- Verifica que `DATABASE_URL` esté presente

### Error en el Build

- Revisa los logs en Railway
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que el script `build` funcione localmente
- **Error "Can't reach database server"**: Esto es normal durante el build. Las migraciones se ejecutan DESPUÉS del despliegue, no durante el build

### Error: "Prisma Client not generated"

- El script `postinstall` debería ejecutarse automáticamente
- Si no, verifica que `prisma generate` esté en el script `postinstall`

### La aplicación no carga

- Verifica que el puerto esté configurado correctamente (Next.js usa el puerto de Railway automáticamente)
- Revisa los logs para ver errores de runtime

## 📝 Checklist de Despliegue

- [ ] Código subido a repositorio Git
- [ ] Proyecto creado en Railway
- [ ] Servicio PostgreSQL agregado
- [ ] Servicio web desplegado
- [ ] Variables de entorno configuradas (automático)
- [ ] **Migraciones y seed ejecutados automáticamente** ✅ (Se ejecutan al iniciar la app)
- [ ] URL de producción verificada
- [ ] Webhook endpoint probado

## 🔗 URLs Importantes

- **Dashboard de Railway**: https://railway.app/dashboard
- **Documentación**: https://docs.railway.app
- **Tu aplicación**: Se genera automáticamente (ej: `tu-proyecto.railway.app`)

## 📞 Próximos Pasos

Una vez desplegado:

1. **Prueba el webhook**: 
   ```bash
   curl -X POST https://tu-proyecto.railway.app/api/webhook/incident \
     -H "Content-Type: application/json" \
     -d '{
       "location_name": "Zara Gran Via",
       "severity": "High",
       "category": "Theft",
       "summary": "Test incident",
       "html_report": "<html><body><h1>Test</h1></body></html>"
     }'
   ```

2. **Verifica el mapa**: Abre la URL de producción y verifica que el mapa cargue correctamente

3. **Configura el dominio**: Si quieres un dominio personalizado, configúralo en Railway

¡Listo! Tu dashboard debería estar funcionando en producción 🎉
