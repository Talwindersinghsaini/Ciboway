"use client"

import { useState } from "react"
import { Check, Plus, ShoppingCart, ChevronRight, Home, Minus, Trash2, Undo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useMealStore } from "@/lib/store/meal-store"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const CATEGORIES = {
  produce: "Produce",
  dairy: "Dairy & Eggs",
  protein: "Meat & Protein",
  pantry: "Pantry",
  grains: "Grains & Bread",
  spices: "Spices & Seasonings",
}

export default function GroceryList() {
  const router = useRouter()
  const { toast } = useToast()
  const { 
    groceryList, 
    mealPlans,
    toggleIngredientChecked, 
    toggleIngredientHaveAtHome,
    updateIngredientServings,
    removeIngredient,
    undoRemoveIngredient
  } = useMealStore()

  const [removedItems, setRemovedItems] = useState<string[]>([])

  // If there are no meal plans, redirect to meal planner
  if (mealPlans.length === 0) {
    router.push("/meal-planner")
    return null
  }

  const categorizedIngredients = groceryList.reduce((acc, ingredient) => {
    const category = ingredient.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(ingredient)
    return acc
  }, {} as Record<string, typeof groceryList>)

  const handleServingChange = (ingredientId: string, increment: boolean) => {
    const ingredient = groceryList.find(i => i.id === ingredientId)
    if (!ingredient) return

    const currentQuantity = parseFloat(ingredient.quantity)
    const newQuantity = increment 
      ? currentQuantity + 1 
      : Math.max(1, currentQuantity - 1)

    updateIngredientServings(ingredientId, newQuantity.toString())
  }

  const handleRemoveItem = (ingredientId: string) => {
    removeIngredient(ingredientId)
    setRemovedItems(prev => [...prev, ingredientId])
    toast({
      title: "Item removed",
      description: "Item has been removed from your grocery list",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUndoRemove(ingredientId)}
        >
          <Undo className="h-4 w-4 mr-2" />
          Undo
        </Button>
      ),
    })
  }

  const handleUndoRemove = (ingredientId: string) => {
    undoRemoveIngredient(ingredientId)
    setRemovedItems(prev => prev.filter(id => id !== ingredientId))
    toast({
      title: "Item restored",
      description: "Item has been added back to your grocery list",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Shopping List</h2>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" /> Shop Now
        </Button>
      </div>

      {removedItems.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
          <span>{removedItems.length} items removed</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              removedItems.forEach(id => undoRemoveIngredient(id))
              setRemovedItems([])
            }}
          >
            <Undo className="h-4 w-4 mr-2" />
            Restore All
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {Object.entries(CATEGORIES).map(([key, categoryName]) => {
          const categoryIngredients = categorizedIngredients[key]
          if (!categoryIngredients?.length) return null

          return (
            <Card key={key} className="p-4">
              <h3 className="font-semibold mb-4">{categoryName}</h3>
              <div className="space-y-2">
                {categoryIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={ingredient.checked}
                        onCheckedChange={() => toggleIngredientChecked(ingredient.id)}
                      />
                      <span className={ingredient.checked ? "line-through text-muted-foreground" : ""}>
                        {ingredient.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleServingChange(ingredient.id, false)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm min-w-[60px] text-center">
                          {parseFloat(ingredient.quantity).toFixed(1)} {ingredient.unit}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleServingChange(ingredient.id, true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={ingredient.haveAtHome ? "text-primary" : ""}
                          >
                            <Home className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                          <SheetHeader>
                            <SheetTitle>{ingredient.name}</SheetTitle>
                            <SheetDescription>
                              Do you have this ingredient at home?
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-6">
                            <Button
                              onClick={() => toggleIngredientHaveAtHome(ingredient.id)}
                              className="w-full"
                            >
                              {ingredient.haveAtHome ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  I have it at home
                                </>
                              ) : (
                                <>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add to shopping list
                                </>
                              )}
                            </Button>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveItem(ingredient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      <div className="fixed bottom-20 right-4">
        <Badge variant="secondary" className="text-xs">
          {groceryList.filter(i => !i.haveAtHome && !i.checked).length} items remaining
        </Badge>
      </div>
    </div>
  )
}