"use client"

import { useState, useMemo } from "react"

export interface Task {
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

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS)
    const [filters, setFilters] = useState({
        categories: [] as string[],
        priorities: [] as string[],
        statuses: [] as string[]
    })
    const [sort, setSort] = useState("deadline-asc")

    const [categories, setCategories] = useState<string[]>(Array.from(new Set(SAMPLE_TASKS.map(t => t.category))))

    const filteredAndSortedTasks = useMemo(() => {
        let result = [...tasks]

        // Apply filters
        // Category (OR)
        if (filters.categories.length > 0) {
            result = result.filter(task => filters.categories.includes(task.category))
        }

        // Priority (OR)
        if (filters.priorities.length > 0) {
            result = result.filter(task => filters.priorities.includes(task.priority))
        }

        // Status (OR)
        if (filters.statuses.length > 0) {
            result = result.filter(task => filters.statuses.includes(task.status))
        }

        // Apply sort
        switch (sort) {
            case "deadline-asc":
                result.sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
                break
            case "deadline-desc":
                result.sort((a, b) => b.deadline.getTime() - a.deadline.getTime())
                break
            case "priority-asc": // Low to High
                const priorityOrderAsc = { low: 0, medium: 1, high: 2 }
                result.sort((a, b) => priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority])
                break
            case "priority-desc": // High to Low
                const priorityOrderDesc = { high: 0, medium: 1, low: 2 }
                result.sort((a, b) => priorityOrderDesc[a.priority] - priorityOrderDesc[b.priority])
                break
        }

        return result
    }, [tasks, filters, sort])

    const addTask = (newTask: Omit<Task, "id">) => {
        const task: Task = {
            ...newTask,
            id: Math.random().toString(36).substr(2, 9),
        }
        setTasks([...tasks, task])
    }

    const updateTask = (task: Task) => {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
    }

    const deleteTask = (taskId: string) => {
        setTasks(tasks.filter((t) => t.id !== taskId))
    }

    const addCategory = (category: string) => {
        if (!categories.includes(category)) {
            setCategories([...categories, category])
        }
    }

    const deleteCategory = (category: string) => {
        const tasksToUpdate = tasks.filter(t => t.category === category)
        const taskIds = tasksToUpdate.map(t => t.id)

        // Remove category
        setCategories(categories.filter((c) => c !== category))

        // Update associated tasks to have no category
        setTasks(tasks.map((t) =>
            t.category === category ? { ...t, category: "" } : t
        ))

        return {
            category,
            taskIds
        }
    }

    const restoreCategory = (category: string, taskIds: string[]) => {
        if (!categories.includes(category)) {
            setCategories(prev => [...prev, category])
        }

        // Restore category to the tasks
        setTasks(prev => prev.map(t =>
            taskIds.includes(t.id) ? { ...t, category } : t
        ))
    }

    return {
        tasks: filteredAndSortedTasks,
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
    }
}
