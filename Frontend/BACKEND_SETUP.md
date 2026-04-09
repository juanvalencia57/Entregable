# Configuración del Backend para Chronosync

## Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` y configura la URL de tu backend:
```env
VITE_API_URL=http://localhost:3000
```

## Endpoints del Backend

La aplicación espera que el backend tenga los siguientes endpoints:

### Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks` | Listar todas las tareas. Soporta filtros opcionales: `?date=YYYY-MM-DD&categoryId=xxx` |
| POST | `/api/tasks` | Crear una nueva tarea |
| GET | `/api/tasks/[id]` | Obtener una tarea específica |
| PUT | `/api/tasks/[id]` | Actualizar una tarea completa |
| DELETE | `/api/tasks/[id]` | Eliminar una tarea |
| PATCH | `/api/tasks/[id]/complete` | Alternar el estado completado de una tarea |

### Categorías

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categories` | Listar todas las categorías |
| POST | `/api/categories` | Crear una nueva categoría |
| GET | `/api/categories/[id]` | Obtener una categoría específica |
| PUT | `/api/categories/[id]` | Actualizar una categoría |
| DELETE | `/api/categories/[id]` | Eliminar una categoría |

## Estructura de Datos

### Task (Tarea)

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // Formato: YYYY-MM-DD
  time: string; // Formato: HH:mm
  completed: boolean;
  categoryId?: string;
}
```

### Category (Categoría)

```typescript
interface Category {
  id: string;
  name: string;
  color?: string;
}
```

## Ejemplo de Respuestas del Backend

### GET /api/tasks
```json
[
  {
    "id": "1",
    "title": "Reunión con el equipo",
    "description": "Discutir el proyecto Q1",
    "date": "2026-04-10",
    "time": "10:00",
    "completed": false,
    "categoryId": "trabajo"
  }
]
```

### POST /api/tasks
**Request:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción opcional",
  "date": "2026-04-10",
  "time": "14:00",
  "completed": false
}
```

**Response:**
```json
{
  "id": "2",
  "title": "Nueva tarea",
  "description": "Descripción opcional",
  "date": "2026-04-10",
  "time": "14:00",
  "completed": false
}
```

### PATCH /api/tasks/[id]/complete
**Response:**
```json
{
  "id": "1",
  "title": "Reunión con el equipo",
  "description": "Discutir el proyecto Q1",
  "date": "2026-04-10",
  "time": "10:00",
  "completed": true,
  "categoryId": "trabajo"
}
```

## Notas Importantes

1. Todas las respuestas deben ser en formato JSON
2. Los códigos de estado HTTP esperados:
   - `200` - Éxito
   - `201` - Creación exitosa
   - `400` - Error de validación
   - `404` - Recurso no encontrado
   - `500` - Error del servidor

3. En caso de error, el backend debe responder con:
```json
{
  "error": "Mensaje de error descriptivo"
}
```

## CORS

Si el frontend y backend están en dominios diferentes, asegúrate de configurar CORS en tu backend Next.js.
