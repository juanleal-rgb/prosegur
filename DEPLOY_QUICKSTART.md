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

### 4️⃣ ¡Listo! Migraciones Automáticas ✅

**🎉 Las migraciones y el seed se ejecutan automáticamente** cuando la aplicación inicia por primera vez.

No necesitas hacer nada - Railway ejecutará:
- ✅ Creación de tablas (`prisma db push`)
- ✅ Datos iniciales (`prisma seed`)
- ✅ Inicio de la aplicación

Todo se configura automáticamente en el primer despliegue.

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
