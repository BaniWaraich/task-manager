"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export interface User {
    name: string
    email: string
    password?: string // In real app, never store plain text
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => boolean
    register: (name: string, email: string, password: string) => boolean
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for logged in user on mount
        const savedUser = localStorage.getItem("auth-user")
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setIsLoading(false)
    }, [])

    const login = (email: string, password: string) => {
        // In a real app, verify password. Here we simulate DB with localStorage 'users' array
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const foundUser = users.find((u: User) => u.email === email && u.password === password)

        if (foundUser) {
            // Don't put password in session storage generally, but for simplicity here we just store the user object
            const { password, ...userWithoutPassword } = foundUser
            setUser(userWithoutPassword as User)
            localStorage.setItem("auth-user", JSON.stringify(userWithoutPassword))
            return true
        }
        return false
    }

    const register = (name: string, email: string, password: string) => {
        const users = JSON.parse(localStorage.getItem("users") || "[]")

        if (users.find((u: User) => u.email === email)) {
            return false // User already exists
        }

        const newUser = { name, email, password }
        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        // Auto login after register
        const { password: _, ...userWithoutPassword } = newUser
        setUser(userWithoutPassword as User)
        localStorage.setItem("auth-user", JSON.stringify(userWithoutPassword))
        return true
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("auth-user")
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
