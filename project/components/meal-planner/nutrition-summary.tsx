"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const NUTRITION_METRICS = [
  {
    label: "Daily Calories",
    current: 1850,
    target: 2000,
    unit: "kcal",
  },
  {
    label: "Protein",
    current: 85,
    target: 100,
    unit: "g",
  },
  {
    label: "Carbohydrates",
    current: 220,
    target: 250,
    unit: "g",
  },
  {
    label: "Healthy Fats",
    current: 55,
    target: 65,
    unit: "g",
  },
  {
    label: "Fiber",
    current: 28,
    target: 30,
    unit: "g",
  },
]

const VITAMINS_MINERALS = [
  { name: "Vitamin D", value: 80 },
  { name: "Iron", value: 90 },
  { name: "Calcium", value: 75 },
  { name: "Vitamin B12", value: 85 },
]

export default function NutritionSummary() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Macronutrients</h3>
        <div className="space-y-4">
          {NUTRITION_METRICS.map((metric) => (
            <div key={metric.label}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{metric.label}</span>
                <span className="text-muted-foreground">
                  {metric.current} / {metric.target} {metric.unit}
                </span>
              </div>
              <Progress
                value={(metric.current / metric.target) * 100}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Vitamins & Minerals</h3>
          <div className="space-y-4">
            {VITAMINS_MINERALS.map((vitamin) => (
              <div key={vitamin.name}>
                <div className="flex justify-between mb-2">
                  <span>{vitamin.name}</span>
                  <span>{vitamin.value}%</span>
                </div>
                <Progress value={vitamin.value} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Weekly Trends</h3>
          <div className="space-y-2 text-sm">
            <p>• Consistent protein intake throughout the week</p>
            <p>• Fiber goals met 6 out of 7 days</p>
            <p>• Calcium intake needs attention</p>
            <p>• Excellent variety of vegetables</p>
          </div>
        </Card>
      </div>
    </div>
  )
}