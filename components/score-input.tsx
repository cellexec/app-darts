"use client"

import { Button } from "@/components/ui/button"
import type { MultiplierType, MultiplierColors } from "./darts-game"

interface ScoreInputProps {
  onScore: (score: number) => void
  disabled?: boolean
  multiplier: MultiplierType
  setMultiplier: (multiplier: MultiplierType) => void
  isBust?: boolean
  multiplierColors: MultiplierColors
}

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

export default function ScoreInput({
  onScore,
  disabled = false,
  multiplier,
  setMultiplier,
  isBust = false,
  multiplierColors,
}: ScoreInputProps) {
  const handleScore = (value: number) => {
    // Record the score with multiplier
    onScore(value * multiplier)

    // Reset multiplier to single (1) after each press
    setMultiplier(1)
  }

  // All inputs should be disabled if there's a bust
  const isDisabled = disabled || isBust

  // Get color for a multiplier
  const getColorForMultiplier = (mult: MultiplierType) => {
    const colorName = multiplierColors[mult]
    return colorToCssVar[colorName as keyof typeof colorToCssVar] || colorToCssVar.gray
  }

  const renderNumberButtons = () => {
    const buttons = []
    const currentColor = getColorForMultiplier(multiplier)

    // Create buttons for numbers 1-20
    for (let i = 1; i <= 20; i++) {
      buttons.push(
        <Button
          key={i}
          variant="default"
          className="h-[calc(20vw-0.5rem)] max-h-28 w-[calc(20vw-0.5rem)] max-w-[7rem] text-4xl font-bold text-foreground"
          onClick={() => handleScore(i)}
          disabled={isDisabled}
          style={{
            backgroundColor: currentColor,
          }}
        >
          {i}
        </Button>,
      )
    }

    return buttons
  }

  // Bull buttons should be disabled for multipliers 2 and 3
  const bullDisabled = multiplier > 1 || isDisabled

  return (
    <div className="space-y-4 flex-1 flex flex-col max-w-5xl mx-auto w-full">
      <div className="grid grid-cols-3 gap-12 mb-8">
        {[1, 2, 3].map((mult) => {
          const isActive = multiplier === mult
          const color = getColorForMultiplier(mult as MultiplierType)

          return (
            <Button
              key={mult}
              variant="outline"
              className="py-10 text-2xl font-medium relative"
              onClick={() => setMultiplier(mult as MultiplierType)}
              disabled={isBust}
              style={{
                borderColor: color,
                color: isActive ? "white" : color,
                backgroundColor: isActive ? color : "transparent",
                // Add hover styles directly
                "--hover-bg": `${color}20`,
              }}
              // Add custom hover effect with CSS
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = `${color}20`
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              × {mult}
            </Button>
          )
        })}
      </div>

      <div className="grid grid-cols-5 gap-2 flex-1">
        {renderNumberButtons()}

        {/* Bull buttons */}
        <Button
          variant="default"
          className="h-[calc(20vw-0.5rem)] max-h-28 w-[calc(20vw-0.5rem)] max-w-[7rem] text-4xl font-bold text-foreground"
          onClick={() => handleScore(25)}
          disabled={bullDisabled}
          style={{
            backgroundColor: multiplier === 1 ? "hsl(var(--red-500))" : "hsl(var(--gray-400))",
          }}
        >
          25
        </Button>

        <Button
          variant="default"
          className="h-[calc(20vw-0.5rem)] max-h-28 w-[calc(20vw-0.5rem)] max-w-[7rem] text-4xl font-bold text-foreground"
          onClick={() => handleScore(50)}
          disabled={bullDisabled}
          style={{
            backgroundColor: multiplier === 1 ? "hsl(var(--red-700))" : "hsl(var(--gray-400))",
          }}
        >
          50
        </Button>
      </div>
    </div>
  )
}
