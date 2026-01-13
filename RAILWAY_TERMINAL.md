# 🖥️ Cómo Acceder a la Terminal en Railway

## Opción 1: Railway CLI (Recomendado - Más Fácil)

### Paso 1: Instalar Railway CLI

```bash
npm i -g @railway/cli
```

### Paso 2: Login

```bash
railway login
```

Esto abrirá tu navegador para autenticarte.

### Paso 3: Conectar a tu Proyecto

```bash
railway link
```

Te pedirá seleccionar:
1. Tu proyecto
2. El servicio (selecciona tu servicio web, no PostgreSQL)

### Paso 4: Ejecutar Comandos

Ahora puedes ejecutar los comandos directamente:

```bash
# Crear las tablas
railway run npm run db:push

# Agregar datos de prueba
railway run npm run db:seed
```

**Ventaja:** Ejecutas los comandos desde tu terminal local, pero se ejecutan en el entorno de Railway.

---

## Opción 2: Terminal en el Dashboard de Railway

### Paso 1: Acceder a la Terminal

1. Ve a [railway.app/dashboard](https://railway.app/dashboard)
2. Selecciona tu **proyecto**
3. Click en tu **servicio web** (no en PostgreSQL)
4. En la parte superior, verás varias pestañas: **"Deployments"**, **"Metrics"**, **"Settings"**, etc.
5. Click en **"Deployments"**
6. Click en el **último deployment** (el más reciente)
7. Verás una sección con pestañas: **"Logs"**, **"Terminal"**, etc.
8. Click en la pestaña **"Terminal"**

### Paso 2: Ejecutar Comandos

Una vez en la terminal, ejecuta:

```bash
# Crear las tablas
npm run db:push

# Agregar datos de prueba
npm run db:seed
```

---

## Opción 3: Desde el Servicio (Método Alternativo)

Si no encuentras la terminal en Deployments:

1. Ve a tu **servicio web** en Railway
2. En la parte superior derecha, busca un botón o menú con **"..."** (tres puntos)
3. Busca la opción **"Open Shell"** o **"Terminal"**
4. O ve directamente a: `https://railway.app/project/TU-PROJECT-ID/service/TU-SERVICE-ID/shell`

---

## 📸 Guía Visual (Pasos en Railway Dashboard)

```
Railway Dashboard
  └── Tu Proyecto
      └── Tu Servicio Web (Next.js)
          └── Pestaña "Deployments"
              └── Último Deployment
                  └── Pestaña "Terminal" ← AQUÍ
```

---

## ⚠️ Importante

- **Ejecuta los comandos en el SERVICIO WEB**, no en PostgreSQL
- Asegúrate de que el servicio web esté **conectado** al servicio PostgreSQL
- Si ves errores de conexión, verifica que `DATABASE_URL` esté configurada

---

## 🐛 Troubleshooting

### No veo la pestaña "Terminal"

**Solución:**
- Asegúrate de estar en el **servicio web**, no en PostgreSQL
- Asegúrate de estar en un **deployment** (no en la vista general)
- Prueba refrescar la página

### El comando no funciona

**Solución:**
- Verifica que estás en el servicio correcto (web, no DB)
- Asegúrate de que el deployment esté completo
- Revisa los logs para ver errores

### Prefiero usar CLI

Si la terminal del dashboard no te funciona, usa Railway CLI (Opción 1) - es más confiable.

---

## ✅ Verificación

Después de ejecutar los comandos, deberías ver:

```
✅ Después de db:push:
   - Tablas creadas exitosamente

✅ Después de db:seed:
   - "✅ Seed completed: Created 3 Zara locations in Madrid"
```

Si ves estos mensajes, ¡todo está funcionando correctamente! 🎉
