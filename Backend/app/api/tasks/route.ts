import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/tasks - List all tasks for the user
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('category_id')
  const date = searchParams.get('date')
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')
  const isCompleted = searchParams.get('is_completed')

  let query = supabase
    .from('tasks')
    .select('*, categories(id, name, color)')
    .eq('user_id', user.id)
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  // Filter by category (HU-03)
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  // Filter by specific date
  if (date) {
    query = query.eq('date', date)
  }

  // Filter by date range (for calendar view)
  if (startDate && endDate) {
    query = query.gte('date', startDate).lte('date', endDate)
  }

  // Filter by completion status (HU-05)
  if (isCompleted !== null && isCompleted !== undefined) {
    query = query.eq('is_completed', isCompleted === 'true')
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Helper function to generate recurring task occurrences (HU-04)
function generateRecurringDates(
  startDate: string,
  endDate: string | null,
  recurrenceType: 'daily' | 'weekly'
): string[] {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date(start)
  
  // Default: generate occurrences for 30 days if no end date
  if (!endDate) {
    end.setDate(end.getDate() + 30)
  }

  const current = new Date(start)
  const increment = recurrenceType === 'daily' ? 1 : 7

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + increment)
  }

  return dates
}

// POST /api/tasks - Create a new task (HU-02, HU-03, HU-04)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { 
    title, 
    description, 
    date, 
    time, 
    category_id, 
    is_recurring, 
    recurrence_type, 
    recurrence_end_date 
  } = body

  // Validation: title, date, and time are required (HU-02 criteria)
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return NextResponse.json(
      { error: 'El título de la tarea es requerido' },
      { status: 400 }
    )
  }

  if (!date) {
    return NextResponse.json(
      { error: 'La fecha es requerida' },
      { status: 400 }
    )
  }

  if (!time) {
    return NextResponse.json(
      { error: 'La hora es requerida' },
      { status: 400 }
    )
  }

  // Handle recurring tasks (HU-04)
  if (is_recurring && recurrence_type) {
    const dates = generateRecurringDates(date, recurrence_end_date, recurrence_type)
    
    // Create the parent task first
    const { data: parentTask, error: parentError } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description || null,
        date,
        time,
        category_id: category_id || null,
        is_recurring: true,
        recurrence_type,
        recurrence_end_date: recurrence_end_date || null
      })
      .select()
      .single()

    if (parentError) {
      return NextResponse.json({ error: parentError.message }, { status: 500 })
    }

    // Create child occurrences (skip the first date since parent already has it)
    const childTasks = dates.slice(1).map(occurrenceDate => ({
      user_id: user.id,
      title: title.trim(),
      description: description || null,
      date: occurrenceDate,
      time,
      category_id: category_id || null,
      is_recurring: true,
      recurrence_type,
      parent_task_id: parentTask.id
    }))

    if (childTasks.length > 0) {
      const { error: childError } = await supabase
        .from('tasks')
        .insert(childTasks)

      if (childError) {
        return NextResponse.json({ error: childError.message }, { status: 500 })
      }
    }

    return NextResponse.json(parentTask, { status: 201 })
  }

  // Create a single non-recurring task
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: description || null,
      date,
      time,
      category_id: category_id || null,
      is_recurring: false
    })
    .select('*, categories(id, name, color)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
