"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Preferences {
  dietary?: {
    dietType: string
    mealsPerDay: number
    restrictions: Record<string, boolean>
  }
  ethical?: {
    sustainableSourcing: number
    animalWelfare: number
    carbonFootprint: number
    fairTrade: number
    localProduction: number
    packageFree: boolean
    organicPreferred: boolean
    seasonalProduce: boolean
    foodWasteReduction: boolean
  }
}

const DEFAULT_PREFERENCES: Preferences = {
  dietary: {
    dietType: "balanced",
    mealsPerDay: 3,
    restrictions: {
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
      vegetarian: false,
      vegan: false,
      pescatarian: false,
      keto: false,
      paleo: false,
      lowCarb: false,
      lowFat: false
    }
  },
  ethical: {
    sustainableSourcing: 50,
    animalWelfare: 50,
    carbonFootprint: 50,
    fairTrade: 50,
    localProduction: 50,
    packageFree: false,
    organicPreferred: false,
    seasonalProduce: false,
    foodWasteReduction: false
  }
}

interface PreferencesStore {
  preferences: Preferences
  updatePreferences: (newPreferences: Preferences) => void
}

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: DEFAULT_PREFERENCES,
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences,
          },
        })),
    }),
    {
      name: "ciboway-preferences",
    }
  )
)