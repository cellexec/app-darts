"use client"

import type { Player } from "@/components/darts-game"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { MultiplierType } from "@/components/darts-game"

interface GameStatsProps {
  players: Player[]
  currentPlayerIndex: number
  throwsRemaining: number
  roundScores: number[]
  roundMultipliers: MultiplierType[]
  gameMode: string
  onEditPlayer: (player: Player) => void
  isBust?: boolean
  bustReason?: string
  potentialRemainingScore: number
}

export default function GameStats({
  players,
  currentPlayerIndex,
  throwsRemaining,
  roundScores,
  roundMultipliers,
  gameMode,
  onEditPlayer,
  isBust = false,
  bustReason = "",
  potentialRemainingScore,
}: GameStatsProps) {
  // Update the getThrowEmoji function to show only the total score without multiplier
  const getThrowEmoji = (index: number) => {
    if (index < 3 - throwsRemaining) {
      const score = roundScores[index]
      const mult = roundMultipliers[index]
      return score !== undefined ? `${score * mult}` : "✓"
    }
    return "🎯"
  }

  // Calculate total round score
  const totalRoundScore = roundScores.reduce((sum, score, index) => sum + score * roundMultipliers[index], 0)

  // Check if potential score would bust
  const wouldBust =
    potentialRemainingScore === 1 ||
    potentialRemainingScore < 0 ||
    (potentialRemainingScore === 0 &&
      (roundMultipliers.length === 0 || roundMultipliers[roundMultipliers.length - 1] !== 2))

  // Calculate the actual negative score for display
  const currentPlayer = players[currentPlayerIndex]
  const actualScore = currentPlayer ? currentPlayer.score - totalRoundScore : 0

  return (
    <div className="space-y-4 max-w-4xl mx-auto w-full">
      <div className="flex flex-col items-center space-y-4 my-4">
        <div className="flex justify-center items-center space-x-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <Badge
              key={i}
              variant={i < 3 - throwsRemaining ? "default" : "outline"}
              className="h-20 w-20 flex items-center justify-center text-3xl border-2"
            >
              {getThrowEmoji(i)}
            </Badge>
          ))}
        </div>

        {roundScores.length > 0 && (
          <div className="text-2xl">
            <span>
              Total: <strong className="text-3xl">{totalRoundScore}</strong>
            </span>
            {isBust && (
              <div className="text-red-500 mt-2">
                <span>
                  Score: <strong className="text-3xl">{actualScore}</strong>
                </span>
                {bustReason && <p className="text-lg mt-1">{bustReason}</p>}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {players.map((player, index) => {
          // Calculate potential score for this player
          const playerPotentialScore =
            index === currentPlayerIndex ? (isBust ? actualScore : potentialRemainingScore) : player.score

          const isCurrentPlayer = index === currentPlayerIndex

          return (
            <Card
              key={player.id}
              className={`${
                isCurrentPlayer ? "border-2 border-primary transform scale-105 transition-all" : "opacity-40"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-xl">
                    {player.name}
                    {isCurrentPlayer && (
                      <Badge variant="secondary" className="ml-2 text-lg">
                        Current
                      </Badge>
                    )}
                  </span>
                  <div className="flex items-center">
                    <div className="text-right">
                      <span className="font-bold text-2xl mr-2">{player.score}</span>
                      {isCurrentPlayer && roundScores.length > 0 && (
                        <span className={`text-lg block ${isBust || wouldBust ? "text-red-500" : "text-green-600"}`}>
                          → {isBust || wouldBust ? actualScore : potentialRemainingScore}
                        </span>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditPlayer(player)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Progress
                  value={100 - (Math.max(0, playerPotentialScore) / Number.parseInt(gameMode)) * 100}
                  className="h-4"
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
