# 🚀 Guía de Configuración Final - Chronosync

Felicidades! El proyecto está casi listo. Aquí te doy **las instrucciones finales** para que funcione completamente.

---

## ✅ Qué se arregló

### Backend
- ✅ Autenticación Supabase integrada
- ✅ Endpoints completamente funcionales
- ✅ RLS (Row Level Security) configurado
- ✅ Base de datos lista en Supabase
- ✅ Deployed en Railway

### Frontend
- ✅ Integración Supabase Auth (Login/Signup)
- ✅ **Mapeo de campos corregido** (completed → is_completed, categoryId → category_id)
- ✅ API correctamente conectada al Backend
- ✅ Autenticación sincronizada con Supabase
- ✅ Variables de entorno configuradas
- ✅ Componentes UI completos

---

## 📋 Lo que NECESITAS hacer ahora

### Paso 1: Obtener Credenciales Supabase

1. Ve a [supabase.com](https://supabase.com) → tu proyecto
2. Settings → API
3. Copia:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJI...`

### Paso 2: Actualizar `.env` del Frontend

En `/Frontend/.env`, cambia estas variables:

```env
VITE_API_URL=http://localhost:3000

# Replaza con tus credenciales de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Paso 3: Ejecutar Script SQL en Supabase

1. Ve a Supabase → SQL Editor
2. Nueva Query
3. Copia TODO de: `Backend/scripts/001_create_tables.sql`
4. Ejecuta
5. Verifica que las tablas se crearon en Table Editor

### Paso 4: Habilitar Autenticación en Supabase

1. Authentication → Providers
2. Habilita: **Email** (ya está por defecto)
3. ✅ Listo

---

## 🏃 Probar Localmente

### Terminal 1: Backend

```bash
cd Backend
npm install        # Si no lo hiciste
npm run dev        # Inicia en http://localhost:3000
```

### Terminal 2: Frontend

```bash
cd Frontend
npm install        # Si no lo hiciste
npm run dev        # Inicia en http://localhost:5173 (o similar)
```

Verás:
1. **Login Page** → Crea una cuenta o inicia sesión
2. **Calendario** → Crea tareas
3. **Checkbox** → Marca como completadas
4. **Logout** → Cierra sesión

---

## 🔄 Histórico de Historias de Usuario

| HU | Funcionalidad | Status |
|----|---|---|
| HU-01 | Crear Categorías | ✅ Implementada |
| HU-02 | Crear Tareas | ✅ Implementada |
| HU-03 | Filtrar por Categoría | ⚠️ API lista, UI pendiente |
| HU-04 | Tareas Recurrentes | ⚠️ API lista, UI pendiente |
| HU-05 | Marcar Completadas | ✅ Implementada |

**Nota:** HU-03 y HU-04 tienen el backend listo pero la interfaz no las muestra aún. El API funciona perfectamente.

---

## 🌐 Desplegar en Railway

### Backend ya deployado ✅

Si necesitas redeployar:
```bash
cd Backend
git push origin main  # Automáticamente redeploya en Railway
```

### Frontend en Railway

1. Ve a [railway.app](https://railway.app) → Tu proyecto
2. Click en **New Service** → **GitHub Repo** → Selecciona Frontend
3. Variables de entorno:
   ```
   VITE_API_URL=https://tu-railway-url-backend.up.railway.app
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. Build Command: `npm install && npm run build`
5. Start Command: `npm run preview` o `npm run build && npm run build`

---

## 🔍 Verificación (Testing)

```bash
# 1. Backend responde:
curl http://localhost:3000/api/categories

# Debería retornar: {"error":"Unauthorized"} ✅

# 2. Frontend carga en:
http://localhost:5173

# Debería mostrar: Login Page ✅
```

---

## 📚 Estructura de Carpetas

```
Entregable/
├── Backend/         (rama: main en GitHub)
│   ├── app/
│   │   ├── api/
│   │   │   ├── categories/
│   │   │   ├── tasks/
│   │   │   └── auth/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── types.ts
│   │   └── utils.ts
│   └── scripts/
│       └── 001_create_tables.sql
│
└── Frontend/        (rama: frontend en GitHub)
    ├── src/
    │   ├── app/
    │   │   ├── App.tsx         ← Main (con login)
    │   │   ├── components/
    │   │   │   ├── auth/
    │   │   │   │   └── LoginPage.tsx
    │   │   │   └── ui/         ← Componentes Radix UI
    │   │   └── services/
    │   │       ├── api.ts      ← Llamadas HTTP (corregido)
    │   │       └── auth.ts     ← Supabase Auth
    │   └── styles/
    ├── .env            ← Configurar aquí
    └── .env.example    ← Referencia
```

---

## 🐛 Solución de Problemas

### "No autenticado" / 401 Unauthorized

→ Verifica que `.env` tenga credenciales Supabase correctas

### "Cannot connect to API"

→ Verifica que VITE_API_URL apunta a `http://localhost:3000` (desarrollo)

### "Error creando usuario"

→ Asegúrate que el usuario no existe en Supabase Auth

### Supabase dice "permission denied"

→ Ejecuta nuevamente el script SQL en Supabase

---

## 🎯 Próximos Pasos (Opcional)

1. **Implementar HU-03:** Mostrar selector de Categorías en formulario
2. **Implementar HU-04:** Agregar opciones de recurrencia
3. **Mejorar UI:** Agregar animaciones, temas oscuro/claro
4. **Móvil:** Hacer responsive design
5. **Testing:** Agregar tests unitarios e integración

---

## 📞 Resumen de URLs

```
Backend Local:     http://localhost:3000
Frontend Local:    http://localhost:5173
Supabase:          https://app.supabase.com
Database Script:   Backend/scripts/001_create_tables.sql

GitHub:            https://github.com/juanvalencia57/Entregable
├─ Main (Backend)  https://github.com/juanvalencia57/Entregable/tree/main
└─ Frontend        https://github.com/juanvalencia57/Entregable/tree/frontend
```

---

¿Necesitas ayuda en algún paso específico?
