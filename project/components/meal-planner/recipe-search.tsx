"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MOCK_RECIPES = [
  {
    id: 1,
    name: "Quinoa Buddha Bowl",
    calories: 450,
    protein: 15,
    time: "25 mins",
    cuisine: "Mediterranean",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
  },
  {
    id: 2,
    name: "Grilled Salmon",
    calories: 550,
    protein: 42,
    time: "20 mins",
    cuisine: "American",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80",
  },
]

export default function RecipeSearch() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cuisines</SelectItem>
            <SelectItem value="mediterranean">Mediterranean</SelectItem>
            <SelectItem value="asian">Asian</SelectItem>
            <SelectItem value="american">American</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {MOCK_RECIPES.map((recipe) => (
          <Card key={recipe.id} className="overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">{recipe.name}</h3>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>{recipe.calories} calories</span>
                <span>{recipe.protein}g protein</span>
                <span>{recipe.time}</span>
                <span>{recipe.cuisine}</span>
              </div>
              <Button className="mt-4 w-full">Add to Meal Plan</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}