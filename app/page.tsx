"use client"

import { useState, useMemo } from "react"
import { TaskFilters } from "@/components/task-filters"
import { TaskTable } from "@/components/task-table"

interface Task {
  id: string
  title: string
  description: string
  deadline: Date
  category: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed"
}

// Sample task data
const SAMPLE_TASKS: Task[] = [
  {
    id: "1",
    title: "Design new dashboard layout",
    description: "Create wireframes and high-fidelity mockups for the updated dashboard interface",
    deadline: new Date(2025, 11, 10),
    category: "Design",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "2",
    title: "Review pull requests",
    description: "Review and merge pending PRs from the team",
    deadline: new Date(2025, 11, 8),
    category: "Development",
    priority: "high",
    status: "todo",
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Update API documentation with new endpoints and examples",
    deadline: new Date(2025, 11, 15),
    category: "Documentation",
    priority: "medium",
    status: "todo",
  },
  {
    id: "4",
    title: "Fix critical bug in auth",
    description: "Resolve the authentication issue affecting user login flow",
    deadline: new Date(2025, 12, 5),
    category: "Development",
    priority: "high",
    status: "todo",
  },
  {
    id: "5",
    title: "Client feedback review",
    description: "Compile and prioritize feedback from recent client meeting",
    deadline: new Date(2025, 11, 9),
    category: "Communication",
    priority: "medium",
    status: "completed",
  },
  {
    id: "6",
    title: "Optimize database queries",
    description: "Identify and optimize slow-running database queries in production",
    deadline: new Date(2025, 12, 12),
    category: "Development",
    priority: "low",
    status: "todo",
  },
]

export default function Dashboard() {
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("due-asc")

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...SAMPLE_TASKS]

    // Apply filter
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    switch (filter) {
      case "today":
        result = result.filter((task) => {
          const taskDate = new Date(task.deadline)
          taskDate.setHours(0, 0, 0, 0)
          return taskDate.getTime() === today.getTime()
        })
        break
      case "upcoming":
        result = result.filter((task) => task.deadline > today && task.status !== "completed")
        break
      case "completed":
        result = result.filter((task) => task.status === "completed")
        break
      case "priority-high":
        result = result.filter((task) => task.priority === "high")
        break
      case "priority-medium":
        result = result.filter((task) => task.priority === "medium")
        break
      case "priority-low":
        result = result.filter((task) => task.priority === "low")
        break
    }

    // Apply sort
    switch (sort) {
      case "due-asc":
        result.sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
        break
      case "due-desc":
        result.sort((a, b) => b.deadline.getTime() - a.deadline.getTime())
        break
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        break
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [filter, sort])

  const handleAddTask = () => {
    alert("Add new task dialog would open here")
  }

  const handleEditTask = (task: Task) => {
    alert(`Edit task: ${task.title}`)
  }

  const handleDeleteTask = (taskId: string) => {
    alert(`Delete task: ${taskId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <p className="text-muted-foreground mt-2">Manage and organize your tasks</p>
      </div>

      <TaskFilters
        onAddTask={handleAddTask}
        onFilterChange={setFilter}
        onSortChange={setSort}
        currentFilter={filter}
        currentSort={sort}
      />

      <TaskTable tasks={filteredAndSortedTasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
    </div>
  )
}
