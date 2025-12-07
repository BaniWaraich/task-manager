"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Plus, Filter, ArrowUpDown } from "lucide-react"

export interface TaskFiltersState {
    filterType: string
    sortBy: string
}

interface TaskFiltersProps {
    onAddTask: () => void
    onFilterChange: (filter: string) => void
    onSortChange: (sort: string) => void
    currentFilter: string
    currentSort: string
}

export function TaskFilters({ onAddTask, onFilterChange, onSortChange, currentFilter, currentSort }: TaskFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-6">
            <Button onClick={onAddTask} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Task
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                        <Filter className="h-4 w-4" />
                        Filter
                        {currentFilter !== "all" && <span className="ml-1 text-xs bg-primary/20 px-2 py-1 rounded">1</span>}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => onFilterChange("all")}>All Tasks</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFilterChange("today")}>Today</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFilterChange("upcoming")}>Upcoming</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFilterChange("completed")}>Completed</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onFilterChange("priority-high")}>High Priority</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFilterChange("priority-medium")}>Medium Priority</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFilterChange("priority-low")}>Low Priority</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                        <ArrowUpDown className="h-4 w-4" />
                        Sort
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => onSortChange("due-asc")}>Due Date (Earliest)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSortChange("due-desc")}>Due Date (Latest)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSortChange("priority")}>Priority</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSortChange("title")}>Title (A-Z)</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
