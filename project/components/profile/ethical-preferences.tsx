"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { usePreferences } from "@/lib/hooks/use-preferences"
import { Card } from "@/components/ui/card"

const ETHICAL_METRICS = {
  sustainableSourcing: "Sustainable Sourcing",
  animalWelfare: "Animal Welfare",
  carbonFootprint: "Carbon Footprint",
  fairTrade: "Fair Trade",
  localProduction: "Local Production"
}

const ETHICAL_TOGGLES = {
  packageFree: "Package Free Products",
  organicPreferred: "Prefer Organic",
  seasonalProduce: "Seasonal Produce",
  foodWasteReduction: "Food Waste Reduction"
}

export default function EthicalPreferences() {
  const { toast } = useToast()
  const { preferences, updatePreferences } = usePreferences()
  const ethical = preferences.ethical || {}

  const handleSave = () => {
    toast({
      title: "Values updated",
      description: "Your ethical preferences have been saved.",
    })
  }

  const updateEthicalPreferences = (newValue: Record<string, number | boolean>) => {
    updatePreferences({
      ...preferences,
      ethical: {
        ...ethical,
        ...newValue
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">Ethical Values</h2>
        <div className="space-y-8">
          {Object.entries(ETHICAL_METRICS).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={key}>{label}</Label>
                <span className="text-sm text-muted-foreground">
                  {ethical[key as keyof typeof ethical] || 0}%
                </span>
              </div>
              <Slider
                id={key}
                value={[ethical[key as keyof typeof ethical] as number || 0]}
                onValueChange={([newValue]) =>
                  updateEthicalPreferences({ [key]: newValue })
                }
                max={100}
                step={1}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">Additional Preferences</h2>
        <div className="space-y-6">
          {Object.entries(ETHICAL_TOGGLES).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={key}>{label}</Label>
              <Switch
                id={key}
                checked={ethical[key as keyof typeof ethical] as boolean || false}
                onCheckedChange={(checked) =>
                  updateEthicalPreferences({ [key]: checked })
                }
              />
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full">
        <Check className="mr-2 h-4 w-4" /> Save Values
      </Button>
    </div>
  )
}