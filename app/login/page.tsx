export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
            <LoginForm />
        </div>
    )
}

import { LoginForm } from "@/components/auth/login-form"
