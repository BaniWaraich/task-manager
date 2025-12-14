"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { user, isLoading } = useAuth()

    const isFocusPage = pathname === "/focus"
    const isAuthPage = pathname === "/login" || pathname === "/register"

    // Initialize sidebar state based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true)
            }
        }
        handleResize()
    }, [])

    // Route Protection
    useEffect(() => {
        if (!isLoading && !user && !isAuthPage) {
            router.push("/login")
        }
    }, [isLoading, user, isAuthPage, router])

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    // Public Routes (Login/Register) - No sidebar/navbar
    if (isAuthPage) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                {/* Optional: Simple Public Header */}
                <main className="flex-1 flex items-center justify-center p-4">
                    {children}
                </main>
            </div>
        )
    }

    // Protected Routes - Dashboard UI
    if (!user) return null // Will redirect in useEffect

    return (
        <div className="min-h-screen bg-background">
            <Navbar
                sidebarOpen={sidebarOpen}
                onSidebarToggle={toggleSidebar}
                isLoggedIn={!!user}
                userName={user.name}
            />
            <div className="flex pt-16">
                <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
                <main className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-64" : ""}`}>
                    <div className={isFocusPage ? "p-0" : "p-4 sm:p-6 lg:p-8"}>{children}</div>
                </main>
            </div>
        </div>
    )
}
