"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ThrowDetail, MultiplierColors } from "./darts-game"

interface ThrowHistoryProps {
  throwHistory: ThrowDetail[]
  multiplierColors: MultiplierColors
}

export default function ThrowHistory({ throwHistory, multiplierColors }: ThrowHistoryProps) {
  // Color mapping for Tailwind colors to CSS variables
  const colorToCssVar = {
    gray: "hsl(var(--gray-500))",
    red: "hsl(var(--red-500))",
    orange: "hsl(var(--orange-500))",
    amber: "hsl(var(--amber-500))",
    yellow: "hsl(var(--yellow-500))",
    lime: "hsl(var(--lime-500))",
    green: "hsl(var(--green-600))",
    emerald: "hsl(var(--emerald-500))",
    teal: "hsl(var(--teal-500))",
    cyan: "hsl(var(--cyan-500))",
    sky: "hsl(var(--sky-500))",
    blue: "hsl(var(--blue-600))",
    indigo: "hsl(var(--indigo-500))",
    violet: "hsl(var(--violet-500))",
    purple: "hsl(var(--purple-500))",
    fuchsia: "hsl(var(--fuchsia-500))",
    pink: "hsl(var(--pink-500))",
    rose: "hsl(var(--rose-500))",
  }

  // Get color for a multiplier
  const getColorForMultiplier = (mult: number) => {
    const colorName = multiplierColors[mult as 1 | 2 | 3]
    return colorToCssVar[colorName as keyof typeof colorToCssVar] || colorToCssVar.gray
  }

  // Get multiplier text
  const getMultiplierText = (mult: number) => {
    switch (mult) {
      case 1:
        return "Single"
      case 2:
        return "Double"
      case 3:
        return "Triple"
      default:
        return "Single"
    }
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Current Round</span>
          <span className="text-sm text-muted-foreground">
            Total: <strong>{throwHistory.reduce((sum, t) => sum + t.totalScore, 0)}</strong>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        {throwHistory.length === 0 ? (
          <p className="text-muted-foreground text-center py-2">No throws yet</p>
        ) : (
          <div className="space-y-2">
            {throwHistory.map((throwDetail, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div className="flex items-center">
                  <Badge
                    className="mr-3 h-8 w-8 flex items-center justify-center"
                    style={{ backgroundColor: getColorForMultiplier(throwDetail.multiplier) }}
                  >
                    {index + 1}
                  </Badge>
                  <div>
                    <span className="font-medium">{getMultiplierText(throwDetail.multiplier)}</span>
                    <span className="text-muted-foreground ml-1">{throwDetail.baseScore}</span>
                  </div>
                </div>
                <span className="text-xl font-bold">{throwDetail.totalScore}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
