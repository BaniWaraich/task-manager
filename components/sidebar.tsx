"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Bell, Flame, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
    },
    {
        label: "Notifications",
        icon: Bell,
        href: "/notifications",
    },
    {
        label: "Focus",
        icon: Flame,
        href: "/focus",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
]

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onToggle} aria-hidden="true" />}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-64px)]",
                    isOpen ? "translate-x-0 z-50" : "-translate-x-full",
                )}
            >
                <nav className="space-y-1 p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || (item.href === "/" && pathname === "/")
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 px-4 py-2 text-base font-medium transition-colors",
                                        isActive
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    )}
                                    onClick={() => {
                                        // Close sidebar on mobile after navigation
                                        if (window.innerWidth < 1024) {
                                            onToggle()
                                        }
                                    }}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
}
