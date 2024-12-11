"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePreferences } from "@/lib/hooks/use-preferences"
import { useToast } from "@/components/ui/use-toast"

const DIET_RESTRICTIONS = {
  glutenFree: "Gluten Free",
  dairyFree: "Dairy Free",
  nutFree: "Nut Free",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  pescatarian: "Pescatarian",
  keto: "Keto",
  paleo: "Paleo",
  lowCarb: "Low Carb",
  lowFat: "Low Fat"
}

const ETHICAL_TOGGLES = {
  packageFree: "Package Free Products",
  organicPreferred: "Prefer Organic",
  seasonalProduce: "Seasonal Produce",
  foodWasteReduction: "Food Waste Reduction"
}

export default function MealPreferences() {
  const { preferences, updatePreferences } = usePreferences()
  const { toast } = useToast()

  // Ensure dietary preferences are initialized
  const dietary = preferences.dietary || {
    dietType: "balanced",
    mealsPerDay: 3,
    restrictions: Object.keys(DIET_RESTRICTIONS).reduce((acc, key) => ({
      ...acc,
      [key]: false
    }), {})
  }

  const ethical = preferences.ethical || {}

  const updateDietaryPreferences = (newValue: Partial<typeof dietary>) => {
    updatePreferences({
      ...preferences,
      dietary: {
        ...dietary,
        ...newValue
      }
    })
  }

  const updateEthicalPreferences = (newValue: Record<string, boolean>) => {
    updatePreferences({
      ...preferences,
      ethical: {
        ...ethical,
        ...newValue
      }
    })
  }

  const handleSave = () => {
    toast({
      title: "Preferences saved",
      description: "Your meal preferences have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Dietary Preferences</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Diet Type</Label>
            <Select
              value={dietary.dietType}
              onValueChange={(value) => updateDietaryPreferences({ dietType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="pescatarian">Pescatarian</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Meals per Day: {dietary.mealsPerDay}</Label>
            <Slider
              value={[dietary.mealsPerDay]}
              min={2}
              max={6}
              step={1}
              onValueChange={([value]) =>
                updateDietaryPreferences({ mealsPerDay: value })
              }
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Ethical Preferences</h3>
        <div className="space-y-4">
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

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Dietary Restrictions</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(DIET_RESTRICTIONS).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Switch
                id={key}
                checked={dietary.restrictions?.[key] || false}
                onCheckedChange={(checked) =>
                  updateDietaryPreferences({
                    restrictions: {
                      ...dietary.restrictions,
                      [key]: checked
                    }
                  })
                }
              />
              <Label htmlFor={key}>{label}</Label>
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full">
        <Check className="mr-2 h-4 w-4" /> Save Preferences
      </Button>
    </div>
  )
}