# 🚀 Despliegue Rápido en Railway

## ⚡ Pasos Rápidos (5 minutos)

### 1️⃣ Inicializar Git (si no lo has hecho)

```bash
git init
git add .
git commit -m "Initial commit: Incident Tracking Dashboard"
```

### 2️⃣ Subir a GitHub/GitLab

```bash
# Crea un repositorio en GitHub primero, luego:
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

### 3️⃣ Desplegar en Railway

1. Ve a [railway.app](https://railway.app) → **"New Project"**
2. **"Deploy from GitHub repo"** → Selecciona tu repo
3. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
4. ¡Listo! Railway desplegará automáticamente

### 4️⃣ Ejecutar Seed (Opcional)

Después del despliegue, ejecuta el seed para tener datos iniciales:

```bash
# Opción 1: Railway CLI
npm i -g @railway/cli
railway login
railway link
railway run npm run db:seed

# Opción 2: Desde Railway Dashboard
# Ve a tu servicio → Deployments → Terminal → npm run db:seed
```

## ✅ Verificación

Tu app estará disponible en: `tu-proyecto.railway.app`

Prueba el webhook:
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

## 📚 Documentación Completa

Ver `RAILWAY_DEPLOY.md` para más detalles.
