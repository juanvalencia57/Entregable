// Chronosync Types

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  category_id: string | null
  title: string
  description: string | null
  date: string
  time: string
  is_completed: boolean
  is_recurring: boolean
  recurrence_type: 'daily' | 'weekly' | null
  recurrence_end_date: string | null
  parent_task_id: string | null
  created_at: string
  updated_at: string
  categories?: Category | null
}

// API Request/Response Types
export interface CreateCategoryRequest {
  name: string
  color?: string
}

export interface UpdateCategoryRequest {
  name: string
  color?: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
  date: string
  time: string
  category_id?: string
  is_recurring?: boolean
  recurrence_type?: 'daily' | 'weekly'
  recurrence_end_date?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  date?: string
  time?: string
  category_id?: string | null
}

export interface TaskFilters {
  category_id?: string
  date?: string
  start_date?: string
  end_date?: string
  is_completed?: boolean
}

export interface ApiError {
  error: string
}

export interface ApiSuccess {
  message: string
}
