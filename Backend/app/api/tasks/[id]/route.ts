import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/tasks/[id] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*, categories(id, name, color)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, date, time, category_id } = body

  // Validation
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return NextResponse.json(
      { error: 'El título de la tarea no puede estar vacío' },
      { status: 400 }
    )
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  }

  if (title !== undefined) updateData.title = title.trim()
  if (description !== undefined) updateData.description = description
  if (date !== undefined) updateData.date = date
  if (time !== undefined) updateData.time = time
  if (category_id !== undefined) updateData.category_id = category_id

  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*, categories(id, name, color)')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Error al actualizar la tarea' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if this is a parent recurring task
  const { data: task } = await supabase
    .from('tasks')
    .select('is_recurring, parent_task_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (task?.is_recurring && !task.parent_task_id) {
    // This is a parent recurring task - delete all children too
    await supabase
      .from('tasks')
      .delete()
      .eq('parent_task_id', id)
      .eq('user_id', user.id)
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Error al eliminar la tarea' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Tarea eliminada correctamente' })
}
