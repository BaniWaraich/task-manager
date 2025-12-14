"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Task } from "@/hooks/use-tasks"

interface TaskTableProps {
    tasks: Task[]
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
}

export function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(tasks.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedTasks = tasks.slice(startIndex, endIndex)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-[color:var(--status-completed)] text-[color:oklch(0.3_0_0)]"
            case "in-progress":
                return "bg-[color:var(--status-in-progress)] text-[color:oklch(0.3_0_0)]"
            case "todo":
                return "bg-[color:var(--status-todo)] text-[color:oklch(0.3_0_0)]"
            default:
                return ""
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-[color:var(--priority-high)] text-[color:oklch(0.3_0_0)]"
            case "medium":
                return "bg-[color:var(--priority-medium)] text-[color:oklch(0.3_0_0)]"
            case "low":
                return "bg-[color:var(--priority-low)] text-[color:oklch(0.3_0_0)]"
            default:
                return ""
        }
    }

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    const handleDelete = () => {
        if (taskToDelete) {
            onDelete(taskToDelete)
            setTaskToDelete(null)
        }
    }

    if (tasks.length === 0) {
        return (
            <div className="border border-dashed rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-2">No tasks found</p>
                <p className="text-sm text-muted-foreground">Create a new task to get started</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block border rounded-lg overflow-hidden bg-card">
                <Table>
                    <TableHeader className="bg-muted/40">
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="font-semibold text-foreground/70">Task Title</TableHead>
                            <TableHead className="font-semibold text-foreground/70">Deadline</TableHead>
                            <TableHead className="font-semibold text-foreground/70">Category</TableHead>
                            <TableHead className="font-semibold text-foreground/70">Priority</TableHead>
                            <TableHead className="font-semibold text-foreground/70">Status</TableHead>
                            <TableHead className="text-right font-semibold text-foreground/70">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTasks.map((task) => (
                            <TableRow key={task.id} className="hover:bg-muted/30 border-b last:border-0">
                                <TableCell className="font-medium">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="cursor-help text-foreground hover:underline">{task.title}</span>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="max-w-xs">
                                                <p>{task.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">{formatDate(task.deadline)}</TableCell>
                                <TableCell className="text-sm">{task.category}</TableCell>
                                <TableCell>
                                    <Badge className={`${getPriorityColor(task.priority)} border-0`}>
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${getStatusColor(task.status)} border-0`}>
                                        {task.status === "in-progress"
                                            ? "In Progress"
                                            : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-8 w-8 p-0">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setTaskToDelete(task.id)}
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {paginatedTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 space-y-3 bg-card hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <h3 className="font-medium text-foreground hover:underline cursor-help mb-1">{task.title}</h3>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="max-w-xs">
                                            <p>{task.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <p className="text-xs text-muted-foreground">{task.description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                                <span className="text-muted-foreground">Deadline</span>
                                <p className="font-medium text-sm">{formatDate(task.deadline)}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Category</span>
                                <p className="font-medium text-sm">{task.category}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Priority</span>
                                <div>
                                    <Badge className={`${getPriorityColor(task.priority)} border-0 text-xs`}>
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Badge className={`${getStatusColor(task.status)} border-0`}>
                                {task.status === "in-progress"
                                    ? "In Progress"
                                    : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </Badge>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-7 w-7 p-0">
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setTaskToDelete(task.id)}
                                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="w-12 bg-transparent">
                                {pageSize}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem
                                onClick={() => {
                                    setPageSize(10)
                                    setCurrentPage(1)
                                }}
                            >
                                10
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setPageSize(15)
                                    setCurrentPage(1)
                                }}
                            >
                                15
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setPageSize(20)
                                    setCurrentPage(1)
                                }}
                            >
                                20
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} • {tasks.length} total tasks
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the task.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
