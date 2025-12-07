"use client"

import { Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavbarProps {
    sidebarOpen: boolean
    onSidebarToggle: () => void
    isLoggedIn?: boolean
    userName?: string
}

export function Navbar({ sidebarOpen, onSidebarToggle, isLoggedIn = false, userName = "John Doe" }: NavbarProps) {
    return (
        <nav className="fixed top-0 z-40 w-full border-b border-border bg-card">
            <div className="flex h-16 items-center justify-between px-4 lg:px-6">
                {/* Left section with hamburger and logo */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onSidebarToggle}
                        className="lg:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-bold text-foreground">Tally</h1>
                </div>

                {/* Right section with profile */}
                <div className="flex items-center gap-2">
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 px-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt={userName} />
                                        <AvatarFallback>
                                            {userName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden text-sm font-medium sm:inline">{userName}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5">
                                    <User className="h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 text-destructive">
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="default" size="sm">
                            Sign in
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}
