# Guía de Configuración - Variables de Entorno

## Variables de Entorno Requeridas

### 1. DATABASE_URL

Esta es la única variable de entorno requerida para que la aplicación funcione.

#### Desarrollo Local

1. Crea un archivo `.env` en la raíz del proyecto:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` con tus credenciales de PostgreSQL:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos?schema=public"
   ```

   **Ejemplo real:**
   ```env
   DATABASE_URL="postgresql://postgres:mipassword@localhost:5432/incident_tracking?schema=public"
   ```

#### Railway (Producción)

1. En Railway, cuando agregas un servicio PostgreSQL, automáticamente se crea la variable `DATABASE_URL`
2. Railway la inyecta automáticamente en tu aplicación
3. No necesitas configurarla manualmente

**Para verificar en Railway:**
- Ve a tu proyecto → Variables
- Busca `DATABASE_URL` (debería estar automáticamente)

## Pasos de Configuración Completa

### Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env
cp .env.example .env
# Edita .env con tus credenciales de PostgreSQL

# 3. Generar cliente de Prisma
npx prisma generate

# 4. Crear las tablas en la base de datos
npm run db:push

# 5. Poblar con datos iniciales (3 ubicaciones Zara en Madrid)
npm run db:seed

# 6. Iniciar servidor de desarrollo
npm run dev
```

### Railway

1. **Conectar tu repositorio:**
   - Crea un nuevo proyecto en Railway
   - Conecta tu repositorio Git

2. **Agregar PostgreSQL:**
   - Click en "+ New" → "Database" → "Add PostgreSQL"
   - Railway creará automáticamente la variable `DATABASE_URL`

3. **Configurar Build:**
   - Railway detectará automáticamente Next.js
   - El script `postinstall` ejecutará `prisma generate` automáticamente

4. **Ejecutar migraciones (opcional):**
   - Puedes usar Railway CLI o ejecutar en el deploy:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

## Verificación

Para verificar que las variables están configuradas correctamente:

```bash
# Verificar que Prisma puede conectarse
npx prisma db pull

# O abrir Prisma Studio
npm run db:studio
```

## Troubleshooting

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Verifica que la URL en `.env` sea correcta
- Verifica que el puerto (por defecto 5432) sea el correcto

### Error: "Authentication failed"
- Verifica usuario y contraseña en `DATABASE_URL`
- Asegúrate de que el usuario tenga permisos en la base de datos

### Railway: "DATABASE_URL not found"
- Asegúrate de haber agregado un servicio PostgreSQL
- Verifica en Variables que `DATABASE_URL` esté presente
