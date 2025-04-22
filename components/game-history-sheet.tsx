"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Player, MultiplierColors, PlayerThrow } from "./darts-game"

interface GameHistorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  players: Player[]
  multiplierColors: MultiplierColors
}

export default function GameHistorySheet({ open, onOpenChange, players, multiplierColors }: GameHistorySheetProps) {
  // Initialize selectedPlayerId safely with useEffect to avoid undefined errors
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)

  // Update selectedPlayerId when players change
  useEffect(() => {
    if (players && players.length > 0) {
      setSelectedPlayerId(players[0].id)
    } else {
      setSelectedPlayerId(null)
    }
  }, [players])

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

  // Group throws by round
  const groupThrowsByRound = (throws: PlayerThrow[]) => {
    const rounds: { [key: number]: PlayerThrow[] } = {}

    throws.forEach((throwItem) => {
      if (!rounds[throwItem.roundNumber]) {
        rounds[throwItem.roundNumber] = []
      }
      rounds[throwItem.roundNumber].push(throwItem)
    })

    return rounds
  }

  // Get selected player
  const selectedPlayer = players?.find((player) => player.id === selectedPlayerId) || null

  // Group throws by round for the selected player
  const roundsMap = selectedPlayer?.throwHistory ? groupThrowsByRound(selectedPlayer.throwHistory) : {}
  const rounds = Object.entries(roundsMap).map(([roundNumber, throws]) => ({
    roundNumber: Number.parseInt(roundNumber),
    throws,
  }))

  // Calculate round totals
  const getRoundTotal = (throws: PlayerThrow[]) => {
    return throws.reduce((total, throwItem) => total + throwItem.totalScore, 0)
  }

  // If there are no players, show a message
  if (!players || players.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[90%] sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-2xl">Game History</SheetTitle>
            <SheetDescription className="text-lg">View throw history for each player</SheetDescription>
          </SheetHeader>
          <div className="py-8 text-center text-muted-foreground">
            No players in the game yet. Add players to see game history.
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90%] sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl">Game History</SheetTitle>
          <SheetDescription className="text-lg">View throw history for each player</SheetDescription>
        </SheetHeader>

        <div className="py-4">
          {selectedPlayerId && (
            <Tabs value={selectedPlayerId} onValueChange={(value) => setSelectedPlayerId(value)} className="w-full">
              {/* Make the tabs list scrollable for many players */}
              <div className="relative">
                <ScrollArea className="w-full pb-2">
                  <TabsList className="inline-flex w-max min-w-full">
                    {players.map((player) => (
                      <TabsTrigger key={player.id} value={player.id} className="px-4 py-2 whitespace-nowrap">
                        {player.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollArea>
              </div>

              {players.map((player) => (
                <TabsContent key={player.id} value={player.id} className="mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-medium">{player.name}'s Throws</h3>
                      <Badge variant="outline" className="text-lg">
                        Score: {player.score}
                      </Badge>
                    </div>

                    {!player.throwHistory || player.throwHistory.length === 0 ? (
                      <Card>
                        <CardContent className="py-6 text-center text-muted-foreground">
                          No throws recorded yet
                        </CardContent>
                      </Card>
                    ) : (
                      <ScrollArea className="h-[calc(100vh-16rem)]">
                        <div className="space-y-4 pr-4">
                          {rounds
                            .sort((a, b) => b.roundNumber - a.roundNumber) // Sort by round number (descending)
                            .map(({ roundNumber, throws }) => (
                              <Card key={roundNumber}>
                                <CardHeader className="py-3">
                                  <CardTitle className="text-lg flex items-center justify-between">
                                    <span>Round {roundNumber}</span>
                                    <span className="text-sm font-normal">
                                      Total: <strong>{getRoundTotal(throws)}</strong>
                                    </span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="py-2">
                                  <div className="space-y-2">
                                    {throws.map((throwItem, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                                      >
                                        <div className="flex items-center">
                                          <Badge
                                            className="mr-3 h-8 w-8 flex items-center justify-center"
                                            style={{ backgroundColor: getColorForMultiplier(throwItem.multiplier) }}
                                          >
                                            {index + 1}
                                          </Badge>
                                          <div>
                                            <span className="font-medium">
                                              {getMultiplierText(throwItem.multiplier)}
                                            </span>
                                            <span className="text-muted-foreground ml-1">{throwItem.baseScore}</span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-xl font-bold">{throwItem.totalScore}</span>
                                          <div className="text-sm text-muted-foreground">
                                            Remaining: {throwItem.remainingScore}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
