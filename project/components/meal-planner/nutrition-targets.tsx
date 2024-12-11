"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"

export default function NutritionTargets() {
  const [targets, setTargets] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  })

  const [progress, setProgress] = useState({
    calories: 1500,
    protein: 100,
    carbs: 180,
    fat: 45,
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Nutrition Targets</h2>

      <div className="grid gap-6">
        {Object.entries(targets).map(([key, value]) => (
          <Card key={key} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="capitalize">{key}</Label>
                <span className="text-sm text-muted-foreground">
                  {progress[key as keyof typeof progress]} / {value}
                  {key === "calories" ? " kcal" : "g"}
                </span>
              </div>

              <Progress
                value={(progress[key as keyof typeof progress] / value) * 100}
              />

              <Slider
                value={[value]}
                max={key === "calories" ? 4000 : 400}
                step={key === "calories" ? 50 : 5}
                onValueChange={([newValue]) =>
                  setTargets((prev) => ({ ...prev, [key]: newValue }))
                }
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}