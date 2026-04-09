const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Interfaz del backend (Supabase)
interface BackendTask {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  is_completed: boolean;
  category_id?: string;
  categories?: {
    id: string;
    name: string;
    color: string;
  } | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_recurring: boolean;
  recurrence_type?: string;
  recurrence_end_date?: string;
  parent_task_id?: string;
}

// Interfaz del frontend (normalizada)
export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  completed: boolean;
  categoryId?: string;
  categoryName?: string;
  categoryColor?: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
}

// Funciones auxiliares para mapear entre backend y frontend
const mapBackendTaskToFrontend = (backendTask: BackendTask): Task => {
  return {
    id: backendTask.id,
    title: backendTask.title,
    description: backendTask.description,
    date: backendTask.date,
    time: backendTask.time,
    completed: backendTask.is_completed,
    categoryId: backendTask.category_id,
    categoryName: backendTask.categories?.name,
    categoryColor: backendTask.categories?.color,
  };
};

const mapFrontendTaskToBackend = (frontendTask: Partial<Task>) => {
  const backendTask: any = {};
  
  if (frontendTask.title !== undefined) backendTask.title = frontendTask.title;
  if (frontendTask.description !== undefined) backendTask.description = frontendTask.description;
  if (frontendTask.date !== undefined) backendTask.date = frontendTask.date;
  if (frontendTask.time !== undefined) backendTask.time = frontendTask.time;
  if (frontendTask.completed !== undefined) backendTask.is_completed = frontendTask.completed;
  if (frontendTask.categoryId !== undefined) backendTask.category_id = frontendTask.categoryId;
  
  return backendTask;
};

export const tasksApi = {
  async getTasks(filters?: { date?: string; categoryId?: string }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.categoryId) params.append('category_id', filters.categoryId);

    const response = await fetch(`${API_BASE_URL}/api/tasks?${params.toString()}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autenticado. Por favor inicia sesión.');
      }
      throw new Error('Error al obtener tareas');
    }
    
    const backendTasks: BackendTask[] = await response.json();
    return backendTasks.map(mapBackendTaskToFrontend);
  },

  async getTask(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      credentials: 'include',
    });
    
    if (!response.ok) throw new Error('Error al obtener tarea');
    const backendTask: BackendTask = await response.json();
    return mapBackendTaskToFrontend(backendTask);
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const backendTask = mapFrontendTaskToBackend(task);
    
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(backendTask),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear tarea');
    }
    
    const backendResponse: BackendTask = await response.json();
    return mapBackendTaskToFrontend(backendResponse);
  },

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const backendTask = mapFrontendTaskToBackend(task);
    
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(backendTask),
    });
    
    if (!response.ok) throw new Error('Error al actualizar tarea');
    const backendResponse: BackendTask = await response.json();
    return mapBackendTaskToFrontend(backendResponse);
  },

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) throw new Error('Error al eliminar tarea');
  },

  async toggleComplete(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/complete`, {
      method: 'PATCH',
      credentials: 'include',
    });
    
    if (!response.ok) throw new Error('Error al actualizar estado');
    const backendResponse: BackendTask = await response.json();
    return mapBackendTaskToFrontend(backendResponse);
  },
};

export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al obtener categorías');
    return response.json();
  },

  async getCategory(id: string): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al obtener categoría');
    return response.json();
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Error al crear categoría');
    return response.json();
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Error al actualizar categoría');
    return response.json();
  },

  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al eliminar categoría');
  },
};
