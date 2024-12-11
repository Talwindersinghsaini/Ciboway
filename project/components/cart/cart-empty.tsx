"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="bg-muted p-6 rounded-full mb-6">
        <ShoppingCart className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Your grocery list is empty</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Add meals to your meal plan to automatically generate your grocery list.
      </p>
      <Link href="/meal-planner">
        <Button>
          Plan Your Meals
        </Button>
      </Link>
    </div>
  )
}