"use client"

import { useState } from "react"
import { TaskFilters } from "@/components/task-filters"
import { TaskTable } from "@/components/task-table"
import { useTasks } from "@/hooks/use-tasks"
import { AddTaskDialog } from "@/components/add-task-dialog"

export default function Dashboard() {
  const {
    tasks,
    filter,
    setFilter,
    sort,
    setSort,
    addTask,
    updateTask,
    deleteTask,
    categories,
    addCategory,
    deleteCategory
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
        onFilterChange={setFilter}
        onSortChange={setSort}
        currentFilter={filter}
        currentSort={sort}
      />

      <TaskTable tasks={tasks} onEdit={updateTask} onDelete={deleteTask} />

      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAddTask={addTask}
        categories={categories}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
      />
    </div>
  )
}

