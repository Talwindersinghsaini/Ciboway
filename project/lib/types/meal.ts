export interface Ingredient {
  id: string
  name: string
  quantity: string
  unit: string
  category: string
  checked: boolean
  haveAtHome: boolean
  price?: number
}

export interface Recipe {
  id: string
  name: string
  servings: number
  ingredients: Ingredient[]
  instructions: string[]
  prepTime: number
  cookTime: number
  calories: number
  protein: number
  carbs: number
  fat: number
  ethicalScore: number
  tags: string[]
  image: string
}

export interface MealPlan {
  id: string
  date: string
  mealType: string
  recipe: Recipe
  servings: number
}

export interface GroceryList {
  id: string
  ingredients: Ingredient[]
  mealPlans: MealPlan[]
  lastUpdated: string
}