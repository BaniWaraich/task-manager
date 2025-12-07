"use client"

import { TaskFilters } from "@/components/task-filters"
import { TaskTable } from "@/components/task-table"
import { useTasks } from "@/hooks/use-tasks"

export default function Dashboard() {
  const { tasks, filter, setFilter, sort, setSort, addTask, updateTask, deleteTask } = useTasks()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <p className="text-muted-foreground mt-2">Manage and organize your tasks</p>
      </div>

      <TaskFilters
        onAddTask={addTask}
        onFilterChange={setFilter}
        onSortChange={setSort}
        currentFilter={filter}
        currentSort={sort}
      />

      <TaskTable tasks={tasks} onEdit={updateTask} onDelete={deleteTask} />
    </div>
  )
}

