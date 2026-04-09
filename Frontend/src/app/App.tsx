import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, PlusIcon, LogOutIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Textarea } from "./components/ui/textarea";
import { tasksApi, Task } from "./services/api";
import { authService, AuthUser } from "./services/auth";
import { LoginPage } from "./components/auth/LoginPage";
import { toast, Toaster } from "sonner";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", date: "", time: "" });
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuthAndLoadTasks();
    
    // Suscribirse a cambios de autenticación
    const { data } = authService.onAuthStateChange((user) => {
      setAuthUser(user);
    });

    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  const checkAuthAndLoadTasks = async () => {
    try {
      setIsCheckingAuth(true);
      const user = await authService.getCurrentUser();
      setAuthUser(user);
      
      if (user) {
        await loadTasks();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setAuthUser(null);
      setTasks([]);
      toast.success('Sesión cerrada');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cerrar sesión';
      toast.error(message);
    }
  };

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await tasksApi.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      toast.error("Error al cargar las tareas");
      console.error("Error loading tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async () => {
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("El título es obligatorio");
      return;
    }

    if (!formData.date) {
      setFormError("La fecha es obligatoria");
      return;
    }

    if (!formData.time) {
      setFormError("La hora es obligatoria");
      return;
    }

    const now = new Date();
    const taskDateTime = new Date(`${formData.date}T${formData.time}`);

    if (taskDateTime < now) {
      setFormError("No se pueden crear tareas en fechas u horas pasadas");
      return;
    }

    try {
      setIsLoading(true);
      const newTask = await tasksApi.createTask({
        title: formData.title,
        description: formData.description || undefined,
        date: formData.date,
        time: formData.time,
        completed: false,
      });

      setTasks([...tasks, newTask]);
      setFormData({ title: "", description: "", date: "", time: "" });
      setIsDialogOpen(false);
      toast.success("Tarea creada exitosamente");
    } catch (error) {
      setFormError("Error al crear la tarea. Inténtalo de nuevo.");
      toast.error("Error al crear la tarea");
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const updatedTask = await tasksApi.toggleComplete(taskId);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
      toast.success(updatedTask.completed ? "Tarea completada" : "Tarea marcada como pendiente");
    } catch (error) {
      toast.error("Error al actualizar la tarea");
      console.error("Error toggling task:", error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTasksForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return tasks.filter(task => task.date === dateKey);
  };

  const handleDayClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay < today) {
      return;
    }

    const dateKey = formatDateKey(date);
    setSelectedDate(dateKey);
  };

  const handleCreateTaskForDay = (date: Date, event: React.MouseEvent) => {
    event.stopPropagation();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay < today) {
      return;
    }

    const dateKey = formatDateKey(date);
    setSelectedDate(dateKey);
    setFormData({ title: "", description: "", date: dateKey, time: "" });
    setIsDialogOpen(true);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const selectedDateTasks = selectedDate
    ? tasks.filter(task => task.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time))
    : [];

  const getTodayTasks = () => {
    const today = new Date();
    const todayKey = formatDateKey(today);
    return tasks.filter(task => task.date === todayKey).sort((a, b) => a.time.localeCompare(b.time));
  };

  const getWeekTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return tasks.filter(task => {
      const taskDate = new Date(task.date + "T00:00:00");
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    }).sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
    });
  };

  const getMonthTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return tasks.filter(task => {
      const taskDate = new Date(task.date + "T00:00:00");
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getMonth() === currentMonth &&
             taskDate.getFullYear() === currentYear &&
             taskDate >= today;
    }).sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
    });
  };

  const isTodaySelected = () => {
    if (!selectedDate) return false;
    const today = new Date();
    const todayKey = formatDateKey(today);
    return selectedDate === todayKey;
  };

  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  return (
    <div className="size-full bg-background">
      {isCheckingAuth ? (
        <div className="flex items-center justify-center py-24 min-h-screen">
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      ) : !authUser ? (
        <LoginPage onLoginSuccess={checkAuthAndLoadTasks} />
      ) : (
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl tracking-tight">Chronosync</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{authUser.email}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOutIcon className="size-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>

        {isLoading && tasks.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-muted-foreground">Cargando tareas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl capitalize">{monthName}</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                    <ChevronLeftIcon />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToNextMonth}>
                    <ChevronRightIcon />
                  </Button>
                </div>
              </div>

            <div className="rounded-lg border">
              <div className="grid grid-cols-7 border-b bg-muted/30">
                {weekDays.map((day) => (
                  <div key={day} className="p-3 text-center text-xs uppercase tracking-wide opacity-60">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square border-b border-r p-2" />;
                  }

                  const dayTasks = getTasksForDate(date);
                  const isCurrentDay = isToday(date);
                  const isPast = isPastDate(date);
                  const isSelected = selectedDate === formatDateKey(date);

                  return (
                    <div
                      key={index}
                      onClick={() => !isPast && handleDayClick(date)}
                      className={`group relative aspect-square border-b border-r p-2 text-left transition-colors ${
                        isPast
                          ? 'cursor-not-allowed opacity-40'
                          : 'cursor-pointer hover:bg-accent/5'
                      } ${
                        isSelected && !isCurrentDay
                          ? 'bg-accent/20'
                          : ''
                      }`}
                    >
                      <div className={`inline-flex size-7 items-center justify-center rounded-full text-sm ${
                        isCurrentDay ? 'bg-primary text-primary-foreground' : ''
                      }`}>
                        {date.getDate()}
                      </div>

                      {!isPast && (
                        <button
                          onClick={(e) => handleCreateTaskForDay(date, e)}
                          className="bg-primary text-primary-foreground absolute right-2 top-2 flex size-6 items-center justify-center rounded-full opacity-0 shadow-md transition-all hover:scale-110 hover:opacity-100 group-hover:opacity-70"
                        >
                          <PlusIcon className="size-3.5" />
                        </button>
                      )}

                      {dayTasks.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {dayTasks.slice(0, 3).map((task) => (
                            <div
                              key={task.id}
                              className={`truncate rounded px-1.5 py-0.5 text-xs ${
                                task.completed
                                  ? 'bg-muted/50 text-muted-foreground line-through'
                                  : 'bg-primary/10 text-primary'
                              }`}
                            >
                              {task.time} {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="text-muted-foreground px-1.5 text-xs">
                              +{dayTasks.length - 3} más
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            {!selectedDate ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">
                  Selecciona un día del calendario para ver o crear tareas
                </p>
              </div>
            ) : isTodaySelected() ? (
              <Tabs defaultValue="today" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="today">Hoy</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mes</TabsTrigger>
                </TabsList>

                <TabsContent value="today" className="mt-4 space-y-2">
                  {getTodayTasks().length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center text-sm">
                      No hay tareas para hoy
                    </p>
                  ) : (
                    getTodayTasks().map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent/5"
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mt-0.5"
                        />

                        <div className="flex-1">
                          <p className={task.completed ? "line-through opacity-60" : ""}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-muted-foreground mt-1 text-xs">
                              {task.description}
                            </p>
                          )}
                          <time className="text-muted-foreground mt-1 block text-xs tabular-nums">
                            {task.time}
                          </time>
                        </div>

                        {task.completed && (
                          <div className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
                            <CheckIcon className="size-3" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="week" className="mt-4 space-y-2">
                  {getWeekTasks().length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center text-sm">
                      No hay tareas para esta semana
                    </p>
                  ) : (
                    getWeekTasks().map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent/5"
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mt-0.5"
                        />

                        <div className="flex-1">
                          <p className={task.completed ? "line-through opacity-60" : ""}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-muted-foreground mt-1 text-xs">
                              {task.description}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <time className="text-muted-foreground tabular-nums">
                              {new Date(task.date + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                            </time>
                            <span className="text-muted-foreground">·</span>
                            <time className="text-muted-foreground tabular-nums">
                              {task.time}
                            </time>
                          </div>
                        </div>

                        {task.completed && (
                          <div className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
                            <CheckIcon className="size-3" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="month" className="mt-4 space-y-2">
                  {getMonthTasks().length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center text-sm">
                      No hay tareas para este mes
                    </p>
                  ) : (
                    getMonthTasks().map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent/5"
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mt-0.5"
                        />

                        <div className="flex-1">
                          <p className={task.completed ? "line-through opacity-60" : ""}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-muted-foreground mt-1 text-xs">
                              {task.description}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <time className="text-muted-foreground tabular-nums">
                              {new Date(task.date + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                            </time>
                            <span className="text-muted-foreground">·</span>
                            <time className="text-muted-foreground tabular-nums">
                              {task.time}
                            </time>
                          </div>
                        </div>

                        {task.completed && (
                          <div className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
                            <CheckIcon className="size-3" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div>
                <h3 className="mb-4 text-sm uppercase tracking-wide opacity-60">
                  Tareas del día {formatSelectedDate(selectedDate)}
                </h3>

                <div className="space-y-2">
                  {selectedDateTasks.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center text-sm">
                      No hay tareas para este día
                    </p>
                  ) : (
                    selectedDateTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-accent/5"
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mt-0.5"
                        />

                        <div className="flex-1">
                          <p className={task.completed ? "line-through opacity-60" : ""}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-muted-foreground mt-1 text-xs">
                              {task.description}
                            </p>
                          )}
                          <time className="text-muted-foreground mt-1 block text-xs tabular-nums">
                            {task.time}
                          </time>
                        </div>

                        {task.completed && (
                          <div className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
                            <CheckIcon className="size-3" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear tarea</DialogTitle>
              <DialogDescription>
                {formData.date && `Fecha: ${formatSelectedDate(formData.date)}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Reunión con el equipo"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Descripción (opcional)</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Agrega detalles sobre esta tarea..."
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Hora</label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              {formError && (
                <p className="text-destructive text-sm">{formError}</p>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTask} disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear tarea"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      )}

      <Toaster />
    </div>
  );
}