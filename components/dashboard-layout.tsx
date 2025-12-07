"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

interface DashboardLayoutProps {
    children: React.ReactNode
    isLoggedIn?: boolean
    userName?: string
}

export function DashboardLayout({ children, isLoggedIn = false, userName = "John Doe" }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

    return (
        <div className="min-h-screen bg-background">
            <Navbar sidebarOpen={sidebarOpen} onSidebarToggle={toggleSidebar} isLoggedIn={isLoggedIn} userName={userName} />
            <div className="flex pt-16">
                <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
                <main className="flex-1 lg:ml-64">
                    <div className="p-4 sm:p-6 lg:p-8">{children}</div>
                </main>
            </div>
        </div>
    )
}
