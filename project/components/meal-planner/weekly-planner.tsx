"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { Calendar, ChevronLeft, ChevronRight, Plus, Trash2, AlertTriangle, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { usePreferences } from "@/lib/hooks/use-preferences"
import { useMealStore } from "@/lib/store/meal-store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { MealPlan } from "@/lib/types/meal"

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const

const SAMPLE_MEALS = [
  {
    id: "1",
    name: "Quinoa Buddha Bowl",
    type: "lunch",
    ingredients: [
      { id: "quinoa", name: "Quinoa", quantity: "1", unit: "cup", category: "grains" },
      { id: "chickpeas", name: "Chickpeas", quantity: "1", unit: "can", category: "pantry" },
      { id: "sweet-potato", name: "Sweet Potato", quantity: "1", unit: "medium", category: "produce" },
      { id: "kale", name: "Kale", quantity: "2", unit: "cups", category: "produce" },
      { id: "tahini", name: "Tahini", quantity: "2", unit: "tbsp", category: "pantry" },
    ],
    allergens: ["sesame"],
    calories: 450,
    protein: 15,
    carbs: 65,
    fat: 18,
    instructions: ["Cook quinoa", "Roast vegetables", "Mix ingredients"],
    prepTime: 15,
    cookTime: 30,
    ethicalScore: 9,
    tags: ["Vegan", "High Protein"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    servings: 2,
  },
]

export default function WeeklyPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedMealType, setSelectedMealType] = useState<typeof MEAL_TYPES[number]>("breakfast")
  const [searchQuery, setSearchQuery] = useState("")
  const { preferences } = usePreferences()
  const { mealPlans, addMealPlan, removeMealPlan, updateMealPlanServings } = useMealStore()
  const { toast } = useToast()

  const handlePreviousDay = () => {
    setCurrentDate(prev => addDays(prev, -1))
  }

  const handleNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1))
  }

  // Check if a meal contains any allergens that the user is allergic to
  const hasAllergenConflict = (mealAllergens: string[]) => {
    if (!preferences?.dietary?.allergies) return false
    return mealAllergens.some(allergen => {
      const allergenKey = allergen.toLowerCase().replace(/\s+/g, '') as keyof typeof preferences.dietary.allergies
      return preferences.dietary.allergies[allergenKey]
    })
  }

  // Filter meals based on search query
  const filteredMeals = SAMPLE_MEALS.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleAddMeal = (recipe: typeof SAMPLE_MEALS[0]) => {
    const mealPlan: MealPlan = {
      id: `meal-${Date.now()}`,
      date: format(currentDate, "yyyy-MM-dd"),
      mealType: selectedMealType,
      recipe,
      servings: recipe.servings,
    }
    
    addMealPlan(mealPlan)
    
    // Show warning if meal contains allergens
    if (hasAllergenConflict(recipe.allergens)) {
      toast({
        title: "Allergen Warning",
        description: `This meal contains allergens you've marked in your preferences.`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Meal added",
        description: `${recipe.name} has been added to your meal plan.`,
      })
    }
  }

  const handleRemoveMeal = (planId: string, mealName: string) => {
    removeMealPlan(planId)
    toast({
      title: "Meal removed",
      description: `${mealName} has been removed from your meal plan.`,
    })
  }

  const handleServingsChange = (planId: string, increment: boolean) => {
    const plan = mealPlans.find(p => p.id === planId)
    if (!plan) return

    const newServings = increment ? plan.servings + 1 : Math.max(1, plan.servings - 1)
    updateMealPlanServings(planId, newServings)
  }

  const dayMealPlans = mealPlans.filter(plan => 
    plan.date === format(currentDate, "yyyy-MM-dd")
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-lg font-semibold">
            {format(currentDate, "EEEE, MMMM d")}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-4">
        {MEAL_TYPES.map(type => {
          const mealsByType = dayMealPlans.filter(plan => plan.mealType === type)

          return (
            <div key={type} className="mb-6 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium capitalize">{type}</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add {type}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add {type}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="search">Search Meals</Label>
                        <Input
                          id="search"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-2">
                          {filteredMeals.map(meal => {
                            const hasAllergens = hasAllergenConflict(meal.allergens)
                            return (
                              <Card
                                key={meal.id}
                                className="p-3 cursor-pointer hover:bg-accent"
                                onClick={() => handleAddMeal(meal)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">{meal.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {meal.calories} kcal
                                    </p>
                                  </div>
                                  {hasAllergens && (
                                    <Badge variant="destructive" className="gap-1">
                                      <AlertTriangle className="h-3 w-3" />
                                      Contains Allergens
                                    </Badge>
                                  )}
                                </div>
                              </Card>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2">
                {mealsByType.map(plan => {
                  const hasAllergens = hasAllergenConflict(plan.recipe.allergens)
                  return (
                    <Card key={plan.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{plan.recipe.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {plan.recipe.calories} kcal • {plan.recipe.protein}g protein
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleServingsChange(plan.id, false)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-sm min-w-[60px] text-center">
                              {plan.servings} servings
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleServingsChange(plan.id, true)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          {hasAllergens && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Contains Allergens
                            </Badge>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove meal</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {plan.recipe.name} from your meal plan?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveMeal(plan.id, plan.recipe.name)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </Card>
                  )
                })}
                {mealsByType.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No meals planned for {type}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}