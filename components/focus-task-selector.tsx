"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useTasks } from "@/hooks/use-tasks"

interface FocusTaskSelectorProps {
    onTaskSelect: (taskId: string | null) => void
    selectedTaskId: string | null
}

export function FocusTaskSelector({ onTaskSelect, selectedTaskId }: FocusTaskSelectorProps) {
    const [open, setOpen] = useState(false)
    const { tasks } = useTasks()

    // Filter out completed tasks - usually you only focus on todo/in-progress
    const activeTasks = tasks.filter(t => t.status !== 'completed')

    const selectedTask = tasks.find(t => t.id === selectedTaskId)

    return (
        <div className="w-full max-w-sm">
            <div className="flex flex-col gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between h-12 text-base font-normal shadow-sm border-2 hover:bg-accent/50 hover:text-accent-foreground"
                        >
                            {selectedTask ? (
                                <div className="flex items-center gap-2 truncate">
                                    <Target className="h-4 w-4 text-primary shrink-0" />
                                    <span className="truncate">{selectedTask.title}</span>
                                </div>
                            ) : (
                                <span className="text-muted-foreground">Select a task...</span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search tasks..." />
                            <CommandList>
                                <CommandEmpty>No tasks found.</CommandEmpty>
                                <CommandGroup>
                                    <CommandItem
                                        value="none"
                                        onSelect={() => {
                                            onTaskSelect(null)
                                            setOpen(false)
                                        }}
                                        className="text-muted-foreground italic"
                                    >
                                        <div className="w-4 mr-2 flex items-center justify-center shrink-0">
                                            <Check
                                                className={cn(
                                                    "h-4 w-4",
                                                    selectedTaskId === null ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </div>
                                        No specific task
                                    </CommandItem>
                                    {activeTasks.map((task) => {
                                        const priorityColor = {
                                            high: "bg-red-500",
                                            medium: "bg-amber-500",
                                            low: "bg-blue-500"
                                        }[task.priority] || "bg-slate-500"

                                        return (
                                            <CommandItem
                                                key={task.id}
                                                value={task.title}
                                                onSelect={() => {
                                                    onTaskSelect(task.id)
                                                    setOpen(false)
                                                }}
                                                className="aria-selected:bg-accent/50"
                                            >
                                                <div className="w-4 mr-2 flex items-center justify-center shrink-0">
                                                    <Check
                                                        className={cn(
                                                            "h-4 w-4",
                                                            selectedTaskId === task.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex flex-col w-full gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn("w-2 h-2 rounded-full shrink-0", priorityColor)} />
                                                        <span className="font-medium">{task.title}</span>
                                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 pointer-events-none">
                                                            {task.category}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground truncate max-w-[280px] pl-4">
                                                        {task.description || "No description"}
                                                    </span>
                                                </div>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {selectedTask && (
                    <div className="bg-muted/30 border rounded-lg p-3 mt-1 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
                        {selectedTask.description || "No description provided."}
                    </div>
                )}
            </div>
        </div>
    )
}
