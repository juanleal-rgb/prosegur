# 🔧 Variables de Entorno en Railway

## Sobre DATABASE_URL

### ¿Qué pasa cuando agregas PostgreSQL?

Cuando agregas un servicio **PostgreSQL** en Railway:

1. ✅ Railway **automáticamente crea** la variable `DATABASE_URL`
2. ✅ Railway **conecta automáticamente** el servicio PostgreSQL a tu servicio web
3. ✅ Si ya existe una `DATABASE_URL` manual, Railway la **sobrescribe** con la correcta

### Recomendación

**Opción 1: Dejar que Railway lo haga (Recomendado)**
- Elimina la variable `DATABASE_URL` manual que agregaste
- Agrega el servicio PostgreSQL
- Railway creará automáticamente la variable correcta

**Opción 2: Dejarla y que Railway la actualice**
- Deja la variable manual
- Agrega el servicio PostgreSQL
- Railway la actualizará automáticamente con la conexión correcta

## Pasos Correctos en Railway

### 1. Agregar Servicio PostgreSQL

1. En tu proyecto Railway → Click **"+ New"**
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway creará el servicio PostgreSQL

### 2. Conectar al Servicio Web

Railway normalmente conecta automáticamente, pero verifica:

1. Ve a tu **servicio web** (Next.js)
2. Click en **"Settings"** → **"Variables"**
3. Deberías ver `DATABASE_URL` con el valor del PostgreSQL
4. Si no está conectado, ve a **"Settings"** → **"Service Connections"**
5. Asegúrate de que PostgreSQL esté conectado

### 3. Verificar la Variable

La variable `DATABASE_URL` debería verse así:
```
postgresql://postgres:PASSWORD@HOST:PORT/railway?sslmode=require
```

**No debería ser:**
- `postgresql://user:password@localhost:5432/...` (local)
- Una URL manual que agregaste

## Troubleshooting

### Error: "DATABASE_URL not found" después de agregar PostgreSQL

**Solución:**
1. Ve a tu servicio web → **"Settings"** → **"Variables"**
2. Verifica que `DATABASE_URL` esté presente
3. Si no está, ve a **"Settings"** → **"Service Connections"**
4. Asegúrate de que PostgreSQL esté conectado al servicio web

### Error: "Connection refused" o "Can't reach database"

**Solución:**
1. Verifica que el servicio PostgreSQL esté **running** (no paused)
2. Verifica que esté **conectado** al servicio web
3. Revisa los logs del servicio PostgreSQL

### La variable no se actualiza

**Solución:**
1. Elimina manualmente la variable `DATABASE_URL` del servicio web
2. Desconecta y reconecta el servicio PostgreSQL
3. O simplemente elimina la variable y Railway la recreará

## Variables que NO debes agregar manualmente

- ❌ `DATABASE_URL` - Railway la crea automáticamente
- ❌ `PORT` - Railway lo configura automáticamente
- ❌ `RAILWAY_ENVIRONMENT` - Railway lo configura automáticamente

## Variables que SÍ puedes agregar manualmente

- ✅ `NODE_ENV=production` (opcional, Railway lo configura)
- ✅ Cualquier variable personalizada que necesites
- ✅ API keys de servicios externos

## Resumen

**TL;DR:** Cuando agregas PostgreSQL en Railway, automáticamente crea/actualiza `DATABASE_URL`. No necesitas configurarla manualmente. Si ya la agregaste, Railway la sobrescribirá con la correcta cuando conectes PostgreSQL.
