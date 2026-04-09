import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/tasks/[id]/complete - Toggle task completion (HU-05)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // First get the current task status
  const { data: currentTask, error: fetchError } = await supabase
    .from('tasks')
    .select('is_completed')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !currentTask) {
    return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 })
  }

  // Toggle the completion status
  const { data, error } = await supabase
    .from('tasks')
    .update({
      is_completed: !currentTask.is_completed,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*, categories(id, name, color)')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Error al actualizar el estado de la tarea' }, { status: 500 })
  }

  return NextResponse.json(data)
}
