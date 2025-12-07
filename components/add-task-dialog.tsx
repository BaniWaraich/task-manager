"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { X } from "lucide-react"
import { toast } from "sonner"
import type { Task } from "@/hooks/use-tasks"

interface AddTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddTask: (task: any) => void
    categories: string[]
    onAddCategory: (category: string) => void
    onDeleteCategory: (category: string) => { category: string; tasks: Task[] } | void
    onRestoreCategory?: (category: string, tasks: Task[]) => void
    tasks?: Task[]
}

export function AddTaskDialog({
    open,
    onOpenChange,
    onAddTask,
    categories,
    onAddCategory,
    onDeleteCategory,
    onRestoreCategory,
    tasks = []
}: AddTaskDialogProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [deadline, setDeadline] = useState<string>(format(new Date(), "yyyy-MM-dd"))
    const [category, setCategory] = useState("")
    const [priority, setPriority] = useState("medium")
    const [status, setStatus] = useState("todo")

    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const categoryInputRef = useRef<HTMLInputElement>(null)

    // Alert State
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !deadline || !category) return

        // Add category if it doesn't exist (handled by default since we just pass the string)
        // But we should notify parent if we want it persisted in the list for future
        if (!categories.includes(category)) {
            onAddCategory(category)
        }

        onAddTask({
            title,
            description,
            deadline: new Date(deadline),
            category,
            priority,
            status,
        })
        onOpenChange(false)
        resetForm()
    }

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setDeadline(format(new Date(), "yyyy-MM-dd"))
        setCategory("")
        setPriority("medium")
        setStatus("todo")
    }

    const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            if (category.trim()) {
                setCategory(category.trim())
                setIsCategoryOpen(false)
                // If it's a new category, we could conceptually add it now or wait for submit. 
                // The requirement says "create it". Since our state is just strings, setting it IS creating it in the UI context until submission.
                // But if we want it to be added to the list immediately:
                if (!categories.includes(category.trim())) {
                    onAddCategory(category.trim())
                    toast.success(`Category "${category.trim()}" created`)
                }
            }
        }
    }

    const confirmDeleteCategory = () => {
        if (!categoryToDelete) return

        const result = onDeleteCategory(categoryToDelete)
        setCategoryToDelete(null)

        // Clear selection if deleted
        if (category === categoryToDelete) setCategory("")

        // Show Undo Toast
        if (result && typeof result === 'object' && 'tasks' in result) { // Safety check
            const { category: deletedCat, tasks: deletedTasks } = result
            toast(`Category "${deletedCat}" deleted`, {
                description: `${deletedTasks.length} tasks removed`,
                action: {
                    label: "Undo",
                    onClick: () => {
                        if (onRestoreCategory) {
                            onRestoreCategory(deletedCat, deletedTasks)
                            toast.success("Restore successful")
                        }
                    },
                },
                duration: 3000,
            })
        }
    }

    const filteredCategories = categories.filter(c =>
        c.toLowerCase().includes(category.toLowerCase())
    )

    const getTaskCount = (cat: string) => tasks.filter(t => t.category === cat).length

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Task Name</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter task name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter task description"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                                <PopoverTrigger asChild>
                                    <div className="relative">
                                        <Input
                                            id="category"
                                            ref={categoryInputRef}
                                            value={category}
                                            onChange={(e) => {
                                                setCategory(e.target.value)
                                                setIsCategoryOpen(true)
                                            }}
                                            onKeyDown={handleCategoryKeyDown}
                                            onFocus={() => setIsCategoryOpen(true)}
                                            placeholder="Type or select a category"
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[var(--radix-popover-trigger-width)] p-1"
                                    align="start"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                >
                                    <div className="max-h-[200px] overflow-y-auto space-y-1">
                                        {filteredCategories.length > 0 ? (
                                            filteredCategories.map(cat => (
                                                <div
                                                    key={cat}
                                                    className="flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer group"
                                                    onClick={() => {
                                                        setCategory(cat)
                                                        setIsCategoryOpen(false)
                                                    }}
                                                >
                                                    <span>{cat}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setCategoryToDelete(cat)
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                No matching categories. Press Enter to create.
                                            </div>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">To Do</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Add Task</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the category "{categoryToDelete}" and {categoryToDelete ? getTaskCount(categoryToDelete) : 0} associated tasks.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
