import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Chronosync API</h1>
          <p className="text-lg text-muted-foreground">
            API REST para el organizador personal de tareas
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Autenticacion</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Todos los endpoints requieren autenticacion via Supabase Auth. 
                El usuario debe estar autenticado para acceder a sus categorias y tareas.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Endpoints de Categorias</h2>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">GET</Badge>
                <CardTitle className="text-lg font-mono">/api/categories</CardTitle>
              </div>
              <CardDescription>Listar todas las categorias del usuario</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Retorna un array con todas las categorias ordenadas por fecha de creacion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-blue-600">POST</Badge>
                <CardTitle className="text-lg font-mono">/api/categories</CardTitle>
              </div>
              <CardDescription>Crear una nueva categoria (HU-01)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Body:</p>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "name": "string (requerido)",
  "color": "string (opcional, default: #3b82f6)"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">GET</Badge>
                <CardTitle className="text-lg font-mono">/api/categories/[id]</CardTitle>
              </div>
              <CardDescription>Obtener una categoria especifica</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-yellow-600">PUT</Badge>
                <CardTitle className="text-lg font-mono">/api/categories/[id]</CardTitle>
              </div>
              <CardDescription>Actualizar una categoria</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-red-600">DELETE</Badge>
                <CardTitle className="text-lg font-mono">/api/categories/[id]</CardTitle>
              </div>
              <CardDescription>Eliminar una categoria</CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Endpoints de Tareas</h2>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">GET</Badge>
                <CardTitle className="text-lg font-mono">/api/tasks</CardTitle>
              </div>
              <CardDescription>Listar todas las tareas del usuario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Query Parameters:</p>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`category_id: string    // Filtrar por categoria (HU-03)
date: string           // Filtrar por fecha (YYYY-MM-DD)
start_date: string     // Inicio del rango
end_date: string       // Fin del rango
is_completed: boolean  // Filtrar por estado (HU-05)`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-blue-600">POST</Badge>
                <CardTitle className="text-lg font-mono">/api/tasks</CardTitle>
              </div>
              <CardDescription>Crear una nueva tarea (HU-02, HU-03, HU-04)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Body:</p>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "title": "string (requerido)",
  "description": "string (opcional)",
  "date": "YYYY-MM-DD (requerido)",
  "time": "HH:MM (requerido)",
  "category_id": "uuid (opcional)",
  "is_recurring": "boolean (opcional)",
  "recurrence_type": "daily | weekly (requerido si is_recurring)",
  "recurrence_end_date": "YYYY-MM-DD (opcional)"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">GET</Badge>
                <CardTitle className="text-lg font-mono">/api/tasks/[id]</CardTitle>
              </div>
              <CardDescription>Obtener una tarea especifica</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-yellow-600">PUT</Badge>
                <CardTitle className="text-lg font-mono">/api/tasks/[id]</CardTitle>
              </div>
              <CardDescription>Actualizar una tarea</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-red-600">DELETE</Badge>
                <CardTitle className="text-lg font-mono">/api/tasks/[id]</CardTitle>
              </div>
              <CardDescription>Eliminar una tarea (y sus ocurrencias si es recurrente)</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-purple-600">PATCH</Badge>
                <CardTitle className="text-lg font-mono">/api/tasks/[id]/complete</CardTitle>
              </div>
              <CardDescription>Marcar tarea como completada/pendiente (HU-05)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Toggle el estado de completado de la tarea. Si esta completada la marca como pendiente y viceversa.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Historias de Usuario Implementadas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">HU-01: Crear Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Los usuarios pueden crear categorias con nombre y color para organizar sus tareas.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">HU-02: Agregar Tareas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Los usuarios pueden crear tareas con titulo, descripcion, fecha y hora.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">HU-03: Asignar Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Las tareas pueden asignarse a una categoria existente y filtrarse por categoria.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">HU-04: Tareas Repetitivas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Soporte para tareas que se repiten diaria o semanalmente.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">HU-05: Marcar Completadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Los usuarios pueden marcar tareas como completadas y filtrar por estado.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>Chronosync API - Backend con Next.js y Supabase</p>
        </footer>
      </div>
    </main>
  )
}
