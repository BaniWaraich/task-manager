"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"
import { FocusSettingsDialog } from "@/components/focus-settings-dialog"
import { cn } from "@/lib/utils"

type TimerMode = 'focus' | 'short-break' | 'long-break'

interface FocusSettings {
    focusDuration: number
    shortBreakDuration: number
    longBreakDuration: number
}

const DEFAULT_SETTINGS: FocusSettings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15
}

export function FocusTimer() {
    const [mode, setMode] = useState<TimerMode>('focus')
    const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.focusDuration * 60)
    const [isActive, setIsActive] = useState(false)
    const [cycleCount, setCycleCount] = useState(0)
    const [settings, setSettings] = useState<FocusSettings>(DEFAULT_SETTINGS)

    // Load settings from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('pomodoro-settings')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setSettings(parsed)
                // If we're not running, update current timer to match new settings (optional behavior)
                // But usually we respect current timer state unless reset. 
                // For initial load, we might want to sync if it's default.
                // Simplified: just load settings. Time update happens on mode switch or reset.
            } catch (e) {
                console.error("Failed to parse settings", e)
            }
        }
    }, [])

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const getTotalTimeForMode = (currentMode: TimerMode, currentSettings: FocusSettings) => {
        switch (currentMode) {
            case 'focus': return currentSettings.focusDuration * 60
            case 'short-break': return currentSettings.shortBreakDuration * 60
            case 'long-break': return currentSettings.longBreakDuration * 60
        }
    }

    const switchMode = (newMode: TimerMode) => {
        setMode(newMode)
        setTimeLeft(getTotalTimeForMode(newMode, settings))
        setIsActive(false)
    }

    const handleTimerComplete = () => {
        setIsActive(false)
        // Play sound? (Optional)

        if (mode === 'focus') {
            const newCycleCount = cycleCount + 1
            setCycleCount(newCycleCount)
            if (newCycleCount % 4 === 0) {
                switchMode('long-break')
            } else {
                switchMode('short-break')
            }
        } else {
            // Break finished, back to focus
            switchMode('focus')
        }
    }

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            handleTimerComplete()
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [isActive, timeLeft])

    const toggleTimer = () => setIsActive(!isActive)

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(getTotalTimeForMode(mode, settings))
    }

    const skipTimer = () => {
        handleTimerComplete()
    }

    const handleSettingsUpdate = (newSettings: FocusSettings) => {
        setSettings(newSettings)
        localStorage.setItem('pomodoro-settings', JSON.stringify(newSettings))

        // If the timer is not running, update the displayed time immediately
        if (!isActive) {
            // We only update if the relevant setting for current mode changed, or just always reset to be safe/simple
            setTimeLeft(getTotalTimeForMode(mode, newSettings))
        }
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const getProgress = () => {
        const total = getTotalTimeForMode(mode, settings)
        return ((total - timeLeft) / total) * 100
    }

    const getModeLabel = () => {
        switch (mode) {
            case 'focus': return "Focus Time"
            case 'short-break': return "Short Break"
            case 'long-break': return "Long Break"
        }
    }

    const getModeColor = () => {
        switch (mode) {
            case 'focus': return "text-primary"
            case 'short-break': return "text-status-completed"
            case 'long-break': return "text-chart-2"
        }
    }

    const getModeBg = () => {
        switch (mode) {
            case 'focus': return "bg-primary/10 text-primary hover:bg-primary/20"
            case 'short-break': return "bg-status-completed/10 text-status-completed hover:bg-status-completed/20"
            case 'long-break': return "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20"
        }
    }

    const getButtonColor = () => {
        switch (mode) {
            case 'focus': return "bg-primary text-primary-foreground shadow-primary/20"
            case 'short-break': return "bg-status-completed text-foreground shadow-status-completed/20"
            case 'long-break': return "bg-chart-2 text-white shadow-chart-2/20"
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-4 py-2">

            {/* Header / Mode Selection */}
            <div className="flex items-center gap-4">
                <FocusSettingsDialog settings={settings} onSave={handleSettingsUpdate} />
                <div className="flex gap-2">
                    {(['focus', 'short-break', 'long-break'] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
                                mode === m
                                    ? getModeBg()
                                    : "text-muted-foreground hover:bg-muted/50"
                            )}
                        >
                            {m === 'focus' && "Focus"}
                            {m === 'short-break' && "Short Break"}
                            {m === 'long-break' && "Long Break"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Massive Timer Display */}
            <div className="relative flex items-center justify-center">
                <div
                    className={cn(
                        "text-[15vh] sm:text-[30vh] font-bold leading-none tracking-tight tabular-nums transition-colors duration-500 select-none",
                        getModeColor()
                    )}
                >
                    {formatTime(timeLeft)}
                </div>

                {/* Subtle Cycle Indicator - moved closer */}
                <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                (cycleCount % 4) + 1 >= i
                                    ? getModeColor().replace("text-", "bg-")
                                    : "bg-muted"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-6">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-muted/50"
                    onClick={resetTimer}
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>

                <Button
                    size="lg"
                    className={cn(
                        "h-16 w-16 rounded-full shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center p-0",
                        isActive
                            ? "bg-slate-800 hover:bg-slate-900 text-white"
                            : getButtonColor()
                    )}
                    onClick={toggleTimer}
                >
                    {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-muted/50"
                    onClick={skipTimer}
                >
                    <SkipForward className="h-4 w-4" />
                </Button>
            </div>

            {/* Status Text (Optional, minimalistic) */}
            <div className="text-lg text-muted-foreground font-light tracking-wide animate-pulse h-8">
                {isActive ? (
                    mode === 'focus' ? "Stay focused..." : "Take a break..."
                ) : (
                    "Ready to start?"
                )}
            </div>

        </div>
    )
}
