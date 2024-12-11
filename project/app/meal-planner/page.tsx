"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WeeklyPlanner from "@/components/meal-planner/weekly-planner"
import EthicalImpact from "@/components/meal-planner/ethical-impact"
import NutritionSummary from "@/components/meal-planner/nutrition-summary"
import MealPreferences from "@/components/meal-planner/meal-preferences"

export default function MealPlannerPage() {
  const [activeTab, setActiveTab] = useState("planner")

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meal Planner</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planner">Weekly Plan</TabsTrigger>
          <TabsTrigger value="impact">Ethical Impact</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="planner" className="space-y-4">
          <WeeklyPlanner />
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <EthicalImpact />
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <NutritionSummary />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <MealPreferences />
        </TabsContent>
      </Tabs>
    </div>
  )
}