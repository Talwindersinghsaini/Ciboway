"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function NotificationSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    emailUpdates: true,
    productAlerts: true,
    weeklyNewsletter: false,
    ethicalAlerts: true,
    specialOffers: true,
  })

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
        <div className="grid gap-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={key} className="capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </Label>
              <Switch
                id={key}
                checked={value}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        <Check className="mr-2 h-4 w-4" /> Save Settings
      </Button>
    </div>
  )
}