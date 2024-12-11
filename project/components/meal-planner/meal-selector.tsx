"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MealSelectorProps {
  mealType: string
  day: string
}

const MOCK_MEALS = [
  {
    id: "1",
    name: "Quinoa Buddha Bowl",
    calories: 450,
    protein: 15,
    ethicalScore: 9.2,
    tags: ["Vegan", "Organic", "Local"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
  },
  {
    id: "2",
    name: "Wild Salmon with Roasted Vegetables",
    calories: 550,
    protein: 42,
    ethicalScore: 8.5,
    tags: ["Sustainable", "High Protein"],
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80",
  },
]

export default function MealSelector({ mealType, day }: MealSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meals</SelectItem>
            <SelectItem value="highProtein">High Protein</SelectItem>
            <SelectItem value="lowCarb">Low Carb</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {MOCK_MEALS.map((meal) => (
          <Card key={meal.id} className="p-4">
            <div className="flex gap-4">
              <img
                src={meal.image}
                alt={meal.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{meal.name}</h4>
                    <div className="flex gap-2 mt-1">
                      {meal.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge variant="outline">{meal.calories} cal</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {meal.protein}g protein • Ethical Score: {meal.ethicalScore}
                  </div>
                  <Button size="sm">Add Meal</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}