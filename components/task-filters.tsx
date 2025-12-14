import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Plus, Filter, ArrowUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export interface FilterState {
    categories: string[]
    statuses: string[]
    priorities: string[]
}

interface TaskFiltersProps {
    onAddTask: () => void
    filters: FilterState
    setFilters: (filters: FilterState) => void
    onSortChange: (sort: string) => void
    currentSort: string
    categories: string[]
}

export function TaskFilters({
    onAddTask,
    filters,
    setFilters,
    onSortChange,
    currentSort,
    categories
}: TaskFiltersProps) {

    const activeFilterCount = filters.categories.length + filters.statuses.length + filters.priorities.length

    const toggleFilter = (type: keyof FilterState, value: string) => {
        const currentValues = filters[type]
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value]

        setFilters({
            ...filters,
            [type]: newValues
        })
    }

    const clearFilters = () => {
        setFilters({
            categories: [],
            statuses: [],
            priorities: []
        })
    }

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
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            {categories.map((category) => (
                                <DropdownMenuCheckboxItem
                                    key={category}
                                    checked={filters.categories.includes(category)}
                                    onCheckedChange={() => toggleFilter('categories', category)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {category}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuCheckboxItem
                                checked={filters.statuses.includes('todo')}
                                onCheckedChange={() => toggleFilter('statuses', 'todo')}
                                onSelect={(e) => e.preventDefault()}
                            >
                                Todo
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={filters.statuses.includes('in-progress')}
                                onCheckedChange={() => toggleFilter('statuses', 'in-progress')}
                                onSelect={(e) => e.preventDefault()}
                            >
                                In Progress
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={filters.statuses.includes('completed')}
                                onCheckedChange={() => toggleFilter('statuses', 'completed')}
                                onSelect={(e) => e.preventDefault()}
                            >
                                Completed
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuCheckboxItem
                                checked={filters.priorities.includes('high')}
                                onCheckedChange={() => toggleFilter('priorities', 'high')}
                                onSelect={(e) => e.preventDefault()}
                            >
                                High
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={filters.priorities.includes('medium')}
                                onCheckedChange={() => toggleFilter('priorities', 'medium')}
                                onSelect={(e) => e.preventDefault()}
                            >
                                Medium
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={filters.priorities.includes('low')}
                                onCheckedChange={() => toggleFilter('priorities', 'low')}
                                onSelect={(e) => e.preventDefault()}
                            >
                                Low
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {activeFilterCount > 0 && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={clearFilters} className="text-red-500 focus:text-red-500">
                                <X className="mr-2 h-4 w-4" />
                                Clear All
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                        <ArrowUpDown className="h-4 w-4" />
                        Sort
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Deadline</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => onSortChange("deadline-asc")}>Earliest First</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSortChange("deadline-desc")}>Latest First</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => onSortChange("priority-desc")}>High to Low</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSortChange("priority-asc")}>Low to High</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
