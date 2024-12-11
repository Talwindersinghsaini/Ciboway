"use client"

import { useState } from "react"
import { Check, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface GroceryItem {
  id: string
  name: string
  quantity: string
  category: string
  checked: boolean
}

const INITIAL_ITEMS: GroceryItem[] = [
  { id: "1", name: "Quinoa", quantity: "2 cups", category: "Grains", checked: false },
  { id: "2", name: "Salmon", quantity: "1 lb", category: "Protein", checked: false },
  { id: "3", name: "Sweet Potato", quantity: "3 medium", category: "Produce", checked: false },
]

export default function GroceryList() {
  const [items, setItems] = useState<GroceryItem[]>(INITIAL_ITEMS)

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Grocery List</h2>
        <div className="space-x-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" /> Shop Now
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {["Produce", "Protein", "Grains"].map(category => (
          <Card key={category} className="p-4">
            <h3 className="font-semibold mb-4">{category}</h3>
            <div className="space-y-2">
              {items
                .filter(item => item.category === category)
                .map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <span className={item.checked ? "line-through text-muted-foreground" : ""}>
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.quantity}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}