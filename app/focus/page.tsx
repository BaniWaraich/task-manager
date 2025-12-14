"use client"

import { useState, useEffect } from "react"
import { FocusTimer } from "@/components/focus-timer"
import { FocusTaskSelector } from "@/components/focus-task-selector"
import { useTasks } from "@/hooks/use-tasks"

export default function FocusPage() {
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const { tasks } = useTasks()

    // Persist selected focus task
    useEffect(() => {
        const savedTaskId = localStorage.getItem('focus-task-id')
        if (savedTaskId) {
            setSelectedTaskId(savedTaskId)
        }
    }, [])

    const handleTaskSelect = (taskId: string | null) => {
        setSelectedTaskId(taskId)
        if (taskId) {
            localStorage.setItem('focus-task-id', taskId)
        } else {
            localStorage.removeItem('focus-task-id')
        }
    }

    const selectedTask = tasks.find(t => t.id === selectedTaskId)

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Left Sidebar - Kept clean, focusing on context/selection */}
            <div className="w-80 border-r bg-muted/10 p-6 flex flex-col overflow-y-auto">
                <div className="flex flex-col gap-4">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Session Goal
                    </label>
                    <FocusTaskSelector
                        selectedTaskId={selectedTaskId}
                        onTaskSelect={handleTaskSelect}
                    />
                </div>
            </div>

            {/* Main Content - Centered and balanced */}
            <div className="flex-1 flex flex-col items-center justify-center bg-background p-8 transition-colors duration-500">
                <div className="flex flex-col items-center w-full max-w-4xl gap-12">
                    <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-700 fill-mode-forwards delay-100">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground/90">
                            Focus Mode
                        </h1>
                    </div>

                    <div className="w-full">
                        <FocusTimer />
                    </div>
                </div>
            </div>
        </div>
    )
}
