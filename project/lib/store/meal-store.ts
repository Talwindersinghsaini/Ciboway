"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Recipe, MealPlan, Ingredient } from "@/lib/types/meal"

interface MealStore {
  mealPlans: MealPlan[]
  groceryList: Ingredient[]
  removedIngredients: Ingredient[]
  addMealPlan: (plan: MealPlan) => void
  removeMealPlan: (planId: string) => void
  updateMealPlanServings: (planId: string, servings: number) => void
  updateGroceryList: () => void
  toggleIngredientChecked: (ingredientId: string) => void
  toggleIngredientHaveAtHome: (ingredientId: string) => void
  updateIngredientServings: (ingredientId: string, newQuantity: string) => void
  removeIngredient: (ingredientId: string) => void
  undoRemoveIngredient: (ingredientId: string) => void
  clearGroceryList: () => void
}

export const useMealStore = create<MealStore>()(
  persist(
    (set, get) => ({
      mealPlans: [],
      groceryList: [],
      removedIngredients: [],
      
      addMealPlan: (plan) => {
        set((state) => ({
          mealPlans: [...state.mealPlans, plan],
        }))
        get().updateGroceryList()
      },
      
      removeMealPlan: (planId) => {
        set((state) => {
          const newState = {
            mealPlans: state.mealPlans.filter((plan) => plan.id !== planId),
          }
          // If there are no meal plans, clear the grocery list
          if (newState.mealPlans.length === 0) {
            return { ...newState, groceryList: [] }
          }
          return newState
        })
        get().updateGroceryList()
      },

      updateMealPlanServings: (planId, servings) => {
        set((state) => ({
          mealPlans: state.mealPlans.map((plan) =>
            plan.id === planId ? { ...plan, servings } : plan
          ),
        }))
        get().updateGroceryList()
      },
      
      updateGroceryList: () => {
        const { mealPlans } = get()
        
        // If there are no meal plans, ensure grocery list is empty
        if (mealPlans.length === 0) {
          set({ groceryList: [] })
          return
        }
        
        const ingredientMap = new Map<string, Ingredient>()
        
        mealPlans.forEach((plan) => {
          plan.recipe.ingredients.forEach((ingredient) => {
            const key = `${ingredient.name.toLowerCase()}-${ingredient.unit}`
            const existing = ingredientMap.get(key)
            if (existing) {
              // Sum up quantities if units match
              const newQuantity = (
                parseFloat(existing.quantity) +
                parseFloat(ingredient.quantity) *
                  (plan.servings / plan.recipe.servings)
              ).toString()
              ingredientMap.set(key, {
                ...existing,
                quantity: newQuantity,
              })
            } else {
              ingredientMap.set(key, {
                ...ingredient,
                id: key,
                quantity: (
                  parseFloat(ingredient.quantity) *
                  (plan.servings / plan.recipe.servings)
                ).toString(),
                checked: false,
                haveAtHome: false,
              })
            }
          })
        })
        
        set({ groceryList: Array.from(ingredientMap.values()) })
      },
      
      toggleIngredientChecked: (ingredientId) => {
        set((state) => ({
          groceryList: state.groceryList.map((item) =>
            item.id === ingredientId
              ? { ...item, checked: !item.checked }
              : item
          ),
        }))
      },
      
      toggleIngredientHaveAtHome: (ingredientId) => {
        set((state) => ({
          groceryList: state.groceryList.map((item) =>
            item.id === ingredientId
              ? { ...item, haveAtHome: !item.haveAtHome }
              : item
          ),
        }))
      },

      updateIngredientServings: (ingredientId, newQuantity) => {
        set((state) => ({
          groceryList: state.groceryList.map((item) =>
            item.id === ingredientId
              ? { ...item, quantity: newQuantity }
              : item
          ),
        }))
      },

      removeIngredient: (ingredientId) => {
        set((state) => {
          const ingredient = state.groceryList.find((item) => item.id === ingredientId)
          if (!ingredient) return state

          return {
            groceryList: state.groceryList.filter((item) => item.id !== ingredientId),
            removedIngredients: [...state.removedIngredients, ingredient],
          }
        })
      },

      undoRemoveIngredient: (ingredientId) => {
        set((state) => {
          const ingredient = state.removedIngredients.find((item) => item.id === ingredientId)
          if (!ingredient) return state

          return {
            groceryList: [...state.groceryList, ingredient],
            removedIngredients: state.removedIngredients.filter((item) => item.id !== ingredientId),
          }
        })
      },
      
      clearGroceryList: () => {
        set({ groceryList: [], removedIngredients: [] })
      },
    }),
    {
      name: "ciboway-meal-store",
    }
  )
)