"use client"

import { useState, useMemo, createContext, useContext, useEffect, ReactNode } from "react"

export interface Task {
    id: string
    title: string
    description: string
    deadline: Date | string // Date for internal use/logic, string when loaded from JSON often needs conversion
    category: string
    priority: "low" | "medium" | "high"
    status: "todo" | "in-progress" | "completed"
}

// Sample task data (fallback if nothing in local storage)
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

interface TaskContextType {
    tasks: Task[]
    filters: {
        categories: string[]
        priorities: string[]
        statuses: string[]
    }
    setFilters: React.Dispatch<React.SetStateAction<{
        categories: string[]
        priorities: string[]
        statuses: string[]
    }>>
    sort: string
    setSort: (sort: string) => void
    addTask: (newTask: Omit<Task, "id">) => void
    updateTask: (task: Task) => void
    deleteTask: (taskId: string) => void
    categories: string[]
    addCategory: (category: string) => void
    deleteCategory: (category: string) => { category: string; taskIds: string[] }
    restoreCategory: (category: string, taskIds: string[]) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
    // Initialize state with sample tasks initially to prevent hydration mismatch, 
    // then effect will load from local storage
    const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS)
    const [isLoaded, setIsLoaded] = useState(false)

    const [filters, setFilters] = useState({
        categories: [] as string[],
        priorities: [] as string[],
        statuses: [] as string[]
    })
    const [sort, setSort] = useState("deadline-asc")

    // Categories are derived from tasks + any specifically added ones? 
    // For now, let's keep separate state for categories to allow empty custom categories if needed
    // or just derive standard ones. The original hook initialized from Set(SAMPLE_TASKS).
    // Let's persist categories too.
    const [categories, setCategories] = useState<string[]>(Array.from(new Set(SAMPLE_TASKS.map(t => t.category))))

    // Load from localStorage on mount
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks')
        const storedCategories = localStorage.getItem('categories')

        if (storedTasks) {
            try {
                const parsedTasks = JSON.parse(storedTasks, (key, value) => {
                    if (key === 'deadline') return new Date(value)
                    return value
                })
                setTasks(parsedTasks)
            } catch (e) {
                console.error("Failed to parse tasks", e)
            }
        }

        if (storedCategories) {
            try {
                setCategories(JSON.parse(storedCategories))
            } catch (e) {
                console.error("Failed to parse categories", e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to localStorage whenever tasks or categories change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('tasks', JSON.stringify(tasks))
        }
    }, [tasks, isLoaded])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('categories', JSON.stringify(categories))
        }
    }, [categories, isLoaded])


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
                result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                break
            case "deadline-desc":
                result.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
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
            // Ensure date object if passed as string/date mixed
            deadline: new Date(newTask.deadline)
        }
        setTasks(prev => [...prev, task])
    }

    const updateTask = (task: Task) => {
        setTasks(prev => prev.map((t) => (t.id === task.id ? { ...task, deadline: new Date(task.deadline) } : t)))
    }

    const deleteTask = (taskId: string) => {
        setTasks(prev => prev.filter((t) => t.id !== taskId))
    }

    const addCategory = (category: string) => {
        if (!categories.includes(category)) {
            setCategories(prev => [...prev, category])
        }
    }

    const deleteCategory = (category: string) => {
        const tasksToUpdate = tasks.filter(t => t.category === category)
        const taskIds = tasksToUpdate.map(t => t.id)

        // Remove category
        setCategories(prev => prev.filter((c) => c !== category))

        // Update associated tasks to have no category
        setTasks(prev => prev.map((t) =>
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

    const value = {
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

    return (
        <TaskContext.Provider value= { value } >
        { children }
        </TaskContext.Provider>
    )
}

export function useTasks() {
    const context = useContext(TaskContext)
    if (context === undefined) {
        throw new Error("useTasks must be used within a TaskProvider")
    }
    return context
}
