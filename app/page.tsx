"use client"

import { useState } from "react"
import { TaskFilters } from "@/components/task-filters"
import { TaskTable } from "@/components/task-table"
import { useTasks } from "@/hooks/use-tasks"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { Toaster } from "@/components/ui/sonner"

export default function Dashboard() {
  const {
    tasks,
    filters,
    setFilters,
    sort,
    setSort,
    addTask,
    updateTask,
    deleteTask,
    categories,
    addCategory,
    deleteCategory,
    restoreCategory
  } = useTasks()

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

  const handleAddTaskClick = () => {
    setIsAddTaskOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <p className="text-muted-foreground mt-2">Manage and organize your tasks</p>
      </div>

      <TaskFilters
        onAddTask={handleAddTaskClick}
        filters={filters}
        setFilters={setFilters}
        onSortChange={setSort}
        currentSort={sort}
        categories={categories}
      />

      <TaskTable tasks={tasks} onEdit={updateTask} onDelete={deleteTask} />

      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAddTask={addTask}
        categories={categories}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onRestoreCategory={restoreCategory}
        tasks={tasks}
      />
      <Toaster />
    </div>
  )
}

