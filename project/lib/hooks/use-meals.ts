"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Meal {
  id: string
  name: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  date: string
  ingredients: string[]
  allergens: string[]
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface MealStore {
  meals: Meal[]
  addMeal: (meal: Meal) => void
  removeMeal: (id: string) => void
  clearMeals: () => void
}

export const useMealStore = create<MealStore>()(
  persist(
    (set) => ({
      meals: [],
      addMeal: (meal) =>
        set((state) => ({
          meals: [...state.meals, { ...meal, id: Math.random().toString() }],
        })),
      removeMeal: (id) =>
        set((state) => ({
          meals: state.meals.filter((meal) => meal.id !== id),
        })),
      clearMeals: () => set({ meals: [] }),
    }),
    {
      name: "ciboway-meals",
    }
  )
)