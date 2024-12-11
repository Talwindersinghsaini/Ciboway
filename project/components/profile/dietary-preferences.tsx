"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

interface DietaryPreference {
  id: string
  label: string
  description: string
}

interface Allergen {
  id: string
  label: string
}

const dietaryPreferences: DietaryPreference[] = [
  {
    id: "keto",
    label: "Keto",
    description: "High-fat, low-carb diet",
  },
  {
    id: "vegan",
    label: "Vegan",
    description: "Plant-based diet excluding all animal products",
  },
  {
    id: "vegetarian",
    label: "Vegetarian",
    description: "Plant-based diet excluding meat",
  },
  {
    id: "paleo",
    label: "Paleo",
    description: "Based on foods similar to what might have been eaten during the Paleolithic era",
  },
  {
    id: "mediterranean",
    label: "Mediterranean",
    description: "Based on the traditional cuisines of Mediterranean countries",
  },
  {
    id: "lowCarb",
    label: "Low Carb",
    description: "Reduced carbohydrate intake",
  },
  {
    id: "lowFat",
    label: "Low Fat",
    description: "Reduced fat intake",
  },
  {
    id: "highProtein",
    label: "High Protein",
    description: "Increased protein intake",
  },
  {
    id: "glutenFree",
    label: "Gluten-Free",
    description: "Excludes gluten-containing foods",
  },
  {
    id: "carnivore",
    label: "Carnivore",
    description: "Animal products only diet",
  },
]

const allergens: Allergen[] = [
  { id: "peanuts", label: "Peanuts" },
  { id: "treeNuts", label: "Tree Nuts" },
  { id: "milk", label: "Milk" },
  { id: "eggs", label: "Eggs" },
  { id: "fish", label: "Fish" },
  { id: "shellfish", label: "Shellfish" },
  { id: "soy", label: "Soy" },
  { id: "wheat", label: "Wheat" },
]

export function DietaryPreferences() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({})
  const [allergies, setAllergies] = useState<Record<string, boolean>>({})

  const handlePreferenceChange = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleAllergyChange = (id: string) => {
    setAllergies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ preferences, allergies })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Diet Type</h3>
        <div className="grid gap-4">
          {dietaryPreferences.map((preference) => (
            <div key={preference.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={preference.id}>{preference.label}</Label>
                <p className="text-sm text-muted-foreground">
                  {preference.description}
                </p>
              </div>
              <Switch
                id={preference.id}
                checked={preferences[preference.id] || false}
                onCheckedChange={() => handlePreferenceChange(preference.id)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Allergies & Intolerances</h3>
        <div className="grid gap-4">
          {allergens.map((allergen) => (
            <div key={allergen.id} className="flex items-center justify-between">
              <Label htmlFor={allergen.id}>{allergen.label}</Label>
              <Switch
                id={allergen.id}
                checked={allergies[allergen.id] || false}
                onCheckedChange={() => handleAllergyChange(allergen.id)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Button type="submit" className="w-full">
        Save Preferences
      </Button>
    </form>
  )
}