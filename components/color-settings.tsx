"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { MultiplierColors } from "./darts-game"

// Available color options with CSS variable mapping
const colorOptions = [
  { value: "gray", label: "Gray", cssVar: "hsl(var(--gray-500))" },
  { value: "red", label: "Red", cssVar: "hsl(var(--red-500))" },
  { value: "orange", label: "Orange", cssVar: "hsl(var(--orange-500))" },
  { value: "amber", label: "Amber", cssVar: "hsl(var(--amber-500))" },
  { value: "yellow", label: "Yellow", cssVar: "hsl(var(--yellow-500))" },
  { value: "lime", label: "Lime", cssVar: "hsl(var(--lime-500))" },
  { value: "green", label: "Green", cssVar: "hsl(var(--green-600))" },
  { value: "emerald", label: "Emerald", cssVar: "hsl(var(--emerald-500))" },
  { value: "teal", label: "Teal", cssVar: "hsl(var(--teal-500))" },
  { value: "cyan", label: "Cyan", cssVar: "hsl(var(--cyan-500))" },
  { value: "sky", label: "Sky", cssVar: "hsl(var(--sky-500))" },
  { value: "blue", label: "Blue", cssVar: "hsl(var(--blue-600))" },
  { value: "indigo", label: "Indigo", cssVar: "hsl(var(--indigo-500))" },
  { value: "violet", label: "Violet", cssVar: "hsl(var(--violet-500))" },
  { value: "purple", label: "Purple", cssVar: "hsl(var(--purple-500))" },
  { value: "fuchsia", label: "Fuchsia", cssVar: "hsl(var(--fuchsia-500))" },
  { value: "pink", label: "Pink", cssVar: "hsl(var(--pink-500))" },
  { value: "rose", label: "Rose", cssVar: "hsl(var(--rose-500))" },
]

interface ColorSettingsProps {
  multiplierColors: MultiplierColors
  setMultiplierColors: (colors: MultiplierColors) => void
  disabled?: boolean
}

export default function ColorSettings({ multiplierColors, setMultiplierColors, disabled = false }: ColorSettingsProps) {
  const handleColorChange = (multiplier: 1 | 2 | 3, color: string) => {
    setMultiplierColors({
      ...multiplierColors,
      [multiplier]: color,
    })
  }

  // Function to get CSS variable for a color
  const getColorCssVar = (colorValue: string) => {
    const colorOption = colorOptions.find((c) => c.value === colorValue)
    return colorOption ? colorOption.cssVar : "hsl(var(--gray-500))"
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">Multiplier Colors</h3>

      {/* Single Multiplier Color */}
      <div className="space-y-2">
        <Label className="text-lg">Single (×1)</Label>
        <div className="grid grid-cols-6 gap-2">
          {colorOptions.map((color) => {
            const isSelected = multiplierColors[1] === color.value
            return (
              <Button
                key={`1-${color.value}`}
                type="button"
                variant="outline"
                className="h-10 w-10 rounded-full p-0"
                style={{
                  borderColor: isSelected ? color.cssVar : "",
                  borderWidth: isSelected ? "2px" : "1px",
                }}
                onClick={() => handleColorChange(1, color.value)}
                disabled={disabled}
              >
                <span className="h-6 w-6 rounded-full" style={{ backgroundColor: color.cssVar }} />
                <span className="sr-only">{color.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Double Multiplier Color */}
      <div className="space-y-2">
        <Label className="text-lg">Double (×2)</Label>
        <div className="grid grid-cols-6 gap-2">
          {colorOptions.map((color) => {
            const isSelected = multiplierColors[2] === color.value
            return (
              <Button
                key={`2-${color.value}`}
                type="button"
                variant="outline"
                className="h-10 w-10 rounded-full p-0"
                style={{
                  borderColor: isSelected ? color.cssVar : "",
                  borderWidth: isSelected ? "2px" : "1px",
                }}
                onClick={() => handleColorChange(2, color.value)}
                disabled={disabled}
              >
                <span className="h-6 w-6 rounded-full" style={{ backgroundColor: color.cssVar }} />
                <span className="sr-only">{color.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Triple Multiplier Color */}
      <div className="space-y-2">
        <Label className="text-lg">Triple (×3)</Label>
        <div className="grid grid-cols-6 gap-2">
          {colorOptions.map((color) => {
            const isSelected = multiplierColors[3] === color.value
            return (
              <Button
                key={`3-${color.value}`}
                type="button"
                variant="outline"
                className="h-10 w-10 rounded-full p-0"
                style={{
                  borderColor: isSelected ? color.cssVar : "",
                  borderWidth: isSelected ? "2px" : "1px",
                }}
                onClick={() => handleColorChange(3, color.value)}
                disabled={disabled}
              >
                <span className="h-6 w-6 rounded-full" style={{ backgroundColor: color.cssVar }} />
                <span className="sr-only">{color.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Reset to defaults button */}
      <Button
        variant="outline"
        onClick={() => setMultiplierColors({ 1: "gray", 2: "green", 3: "blue" })}
        disabled={disabled}
        className="w-full mt-4"
      >
        Reset to Default Colors
      </Button>
    </div>
  )
}
