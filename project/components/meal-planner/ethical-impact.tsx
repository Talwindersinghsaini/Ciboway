"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const IMPACT_METRICS = [
  {
    label: "Carbon Footprint Saved",
    value: 75,
    description: "12.5 kg CO2 equivalent reduced",
    color: "bg-green-500",
  },
  {
    label: "Animal Welfare Impact",
    value: 85,
    description: "15 animal products avoided",
    color: "bg-blue-500",
  },
  {
    label: "Fair Trade Support",
    value: 60,
    description: "8 fair trade products used",
    color: "bg-yellow-500",
  },
  {
    label: "Local Sourcing",
    value: 45,
    description: "6 local ingredients used",
    color: "bg-purple-500",
  },
]

export default function EthicalImpact() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {IMPACT_METRICS.map((metric) => (
          <Card key={metric.label} className="p-6">
            <h3 className="font-semibold mb-2">{metric.label}</h3>
            <Progress value={metric.value} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {metric.description}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Weekly Impact Summary</h3>
        <div className="prose prose-sm">
          <p>
            This week, your food choices have made a significant positive impact:
          </p>
          <ul>
            <li>Reduced carbon emissions equivalent to a 50-mile car journey</li>
            <li>Supported 5 fair trade farming communities</li>
            <li>Chose 80% locally sourced ingredients</li>
            <li>Selected 90% organic produce</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}