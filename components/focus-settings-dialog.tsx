"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"

interface FocusSettings {
    focusDuration: number
    shortBreakDuration: number
    longBreakDuration: number
}

interface FocusSettingsDialogProps {
    settings: FocusSettings
    onSave: (settings: FocusSettings) => void
}

export function FocusSettingsDialog({ settings, onSave }: FocusSettingsDialogProps) {
    const [open, setOpen] = useState(false)
    const [localSettings, setLocalSettings] = useState<FocusSettings>(settings)

    const handleChange = (key: keyof FocusSettings, value: string) => {
        const numValue = parseInt(value)
        if (!isNaN(numValue) && numValue > 0) {
            setLocalSettings(prev => ({ ...prev, [key]: numValue }))
        }
    }

    const handleSave = () => {
        onSave(localSettings)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Timer Settings</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="focus" className="text-right col-span-2">
                            Focus Duration (min)
                        </Label>
                        <Input
                            id="focus"
                            type="number"
                            value={localSettings.focusDuration}
                            onChange={(e) => handleChange("focusDuration", e.target.value)}
                            className="col-span-2"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="shortBreak" className="text-right col-span-2">
                            Short Break (min)
                        </Label>
                        <Input
                            id="shortBreak"
                            type="number"
                            value={localSettings.shortBreakDuration}
                            onChange={(e) => handleChange("shortBreakDuration", e.target.value)}
                            className="col-span-2"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="longBreak" className="text-right col-span-2">
                            Long Break (min)
                        </Label>
                        <Input
                            id="longBreak"
                            type="number"
                            value={localSettings.longBreakDuration}
                            onChange={(e) => handleChange("longBreakDuration", e.target.value)}
                            className="col-span-2"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
