import { FocusTimer } from "@/components/focus-timer"

export default function FocusPage() {
    return (
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="flex flex-col gap-4">
                {/* Header reduced or hidden since timer is huge? Keeping it small */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Focus Mode</h1>
                    {/* Description removed for space */}
                </div>

                <div className="mt-2">
                    <FocusTimer />
                </div>
            </div>
        </div>
    )
}
