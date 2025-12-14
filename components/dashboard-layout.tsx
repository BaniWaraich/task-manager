"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

interface DashboardLayoutProps {
    children: React.ReactNode
    isLoggedIn?: boolean
    userName?: string
}

export function DashboardLayout({ children, isLoggedIn = false, userName = "John Doe" }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Initialize sidebar state based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true)
            }
        }

        // Set initial state
        handleResize()

        // Optional: Listen for resize events if we want to auto-open/close when resizing
        // window.addEventListener('resize', handleResize)
        // return () => window.removeEventListener('resize', handleResize)
    }, [])

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

    return (
        <div className="min-h-screen bg-background">
            <Navbar sidebarOpen={sidebarOpen} onSidebarToggle={toggleSidebar} isLoggedIn={isLoggedIn} userName={userName} />
            <div className="flex pt-16">
                <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
                <main className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-64" : ""}`}>
                    <div className="p-4 sm:p-6 lg:p-8">{children}</div>
                </main>
            </div>
        </div>
    )
}
