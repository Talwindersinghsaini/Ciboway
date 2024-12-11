"use client"

import { useState } from "react"
import { Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface MealSchedulerProps {
  selectedDate: Date
}

interface Meal {
  id: string
  time: string
  recipe: string
  calories: number
}

const DEFAULT_MEALS = [
  { id: "1", time: "08:00", recipe: "Oatmeal with Berries", calories: 350 },
  { id: "2", time: "13:00", recipe: "Quinoa Buddha Bowl", calories: 450 },
  { id: "3", time: "19:00", recipe: "Grilled Salmon with Vegetables", calories: 550 },
]

export default function MealScheduler({ selectedDate }: MealSchedulerProps) {
  const [meals, setMeals] = useState<Meal[]>(DEFAULT_MEALS)
  const { toast } = useToast()

  const addMeal = () => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      time: "12:00",
      recipe: "Select Recipe",
      calories: 0,
    }
    setMeals([...meals, newMeal])
  }

  const saveMealPlan = () => {
    toast({
      title: "Meal plan saved",
      description: "Your meal plan has been saved successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Meal Plan for {selectedDate.toLocaleDateString()}
        </h2>
        <div className="space-x-2">
          <Button onClick={addMeal} variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Meal
          </Button>
          <Button onClick={saveMealPlan}>
            <Save className="mr-2 h-4 w-4" /> Save Plan
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {meals.map((meal) => (
          <Card key={meal.id} className="p-4">
            <div className="flex items-center gap-4">
              <Select defaultValue={meal.time}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem
                      key={i}
                      value={`${String(i).padStart(2, "0")}:00`}
                    >
                      {`${String(i).padStart(2, "0")}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select defaultValue={meal.recipe}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select recipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oatmeal with Berries">
                    Oatmeal with Berries (350 cal)
                  </SelectItem>
                  <SelectItem value="Quinoa Buddha Bowl">
                    Quinoa Buddha Bowl (450 cal)
                  </SelectItem>
                  <SelectItem value="Grilled Salmon with Vegetables">
                    Grilled Salmon with Vegetables (550 cal)
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">
                {meal.calories} calories
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}