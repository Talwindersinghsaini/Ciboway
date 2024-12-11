"use client"

import { useMealStore } from "@/lib/store/meal-store"
import GroceryList from "@/components/cart/grocery-list"
import CartEmpty from "@/components/cart/cart-empty"

export default function CartPage() {
  const { groceryList } = useMealStore()

  return (
    <div className="container mx-auto px-4 py-8">
      {groceryList.length === 0 ? (
        <CartEmpty />
      ) : (
        <GroceryList />
      )}
    </div>
  )
}