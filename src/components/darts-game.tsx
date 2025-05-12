"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Settings, RotateCcw, CheckCircle, ArrowRight, XCircle, RefreshCw, History } from "lucide-react"
import PlayerManagement from "@/components/player-management"
import ScoreInput from "@/components/score-input"
import GameStats from "@/components/game-stats"
import EditScoreDialog from "@/components/edit-score-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import ColorSettings from "@/components/color-settings"
import GameHistorySheet from "@/components/game-history-sheet"

export type Player = {
  id: string
  name: string
  score: number
  throws: number[]
  // Add detailed throw history
  throwHistory: PlayerThrow[]
}

export type GameMode = "301" | "501" | "701"
export type MultiplierType = 1 | 2 | 3

// Define the color settings type
export type MultiplierColors = {
  1: string
  2: string
  3: string
}

// Define the throw type to track detailed throw information
export type ThrowDetail = {
  baseScore: number
  multiplier: MultiplierType
  totalScore: number
}

// Define the player throw type with round information
export type PlayerThrow = ThrowDetail & {
  roundNumber: number
  remainingScore: number
}

// Default multiplier colors
export const DEFAULT_MULTIPLIER_COLORS: MultiplierColors = {
  1: "gray",
  2: "green",
  3: "blue",
}

export default function DartsGame() {
  const [players, setPlayers] = useState<Player[]>([])
  const [gameMode, setGameMode] = useState<GameMode>("501")
  const [gameStarted, setGameStarted] = useState(false)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [throwsRemaining, setThrowsRemaining] = useState(3)
  const [roundScores, setRoundScores] = useState<number[]>([])
  const [roundMultipliers, setRoundMultipliers] = useState<MultiplierType[]>([])
  const [currentRoundThrows, setCurrentRoundThrows] = useState<ThrowDetail[]>([])
  const [winner, setWinner] = useState<Player | null>(null)
  const [isBust, setIsBust] = useState(false)
  const [multiplier, setMultiplier] = useState<MultiplierType>(1)
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null)
  const [bustReason, setBustReason] = useState<string>("")
  const [multiplierColors, setMultiplierColors] = useState<MultiplierColors>(DEFAULT_MULTIPLIER_COLORS)
  const [roundNumber, setRoundNumber] = useState(1)
  const [historySheetOpen, setHistorySheetOpen] = useState(false)

  // Load players from localStorage
  useEffect(() => {
    const savedPlayers = localStorage.getItem("dartsPlayers")
    if (savedPlayers) {
      try {
        const parsedPlayers = JSON.parse(savedPlayers)
        // Ensure throwHistory exists for each player
        const playersWithHistory = parsedPlayers.map((player: any) => ({
          ...player,
          throwHistory: player.throwHistory || [],
        }))
        setPlayers(playersWithHistory)
      } catch (e) {
        console.error("Error parsing saved players:", e)
        setPlayers([])
      }
    }

    // Load game mode
    const savedGameMode = localStorage.getItem("dartsGameMode")
    if (savedGameMode) {
      setGameMode(savedGameMode as GameMode)
    }

    // Load multiplier colors
    const savedColors = localStorage.getItem("dartsMultiplierColors")
    if (savedColors) {
      try {
        setMultiplierColors(JSON.parse(savedColors))
      } catch (e) {
        console.error("Error parsing saved colors:", e)
        setMultiplierColors(DEFAULT_MULTIPLIER_COLORS)
      }
    }
  }, [])

  // Save players to localStorage
  useEffect(() => {
    localStorage.setItem("dartsPlayers", JSON.stringify(players))
  }, [players])

  // Save game mode to localStorage
  useEffect(() => {
    localStorage.setItem("dartsGameMode", gameMode)
  }, [gameMode])

  // Save multiplier colors to localStorage
  useEffect(() => {
    localStorage.setItem("dartsMultiplierColors", JSON.stringify(multiplierColors))
  }, [multiplierColors])

  const startGame = () => {
    if (players.length < 1) return

    const initialScore = Number.parseInt(gameMode)
    const newPlayers = players.map((player) => ({
      ...player,
      score: initialScore,
      throws: [],
      throwHistory: [],
    }))

    setPlayers(newPlayers)
    setCurrentPlayerIndex(0)
    setThrowsRemaining(3)
    setRoundScores([])
    setRoundMultipliers([])
    setCurrentRoundThrows([])
    setGameStarted(true)
    setWinner(null)
    setIsBust(false)
    setBustReason("")
    setRoundNumber(1)
  }

  // Quick reset game with same players and settings
  const quickResetGame = () => {
    startGame()
  }

  const handleScore = (score: number) => {
    if (!gameStarted || winner || isBust) return

    // Calculate the base score (not multiplied)
    const baseScore = score / multiplier

    // Add to round scores and multipliers
    setRoundScores([...roundScores, baseScore])
    setRoundMultipliers([...roundMultipliers, multiplier])

    // Calculate the remaining score after this throw
    const currentPlayer = { ...players[currentPlayerIndex] }
    const newRoundScores = [...roundScores, baseScore]
    const newRoundMultipliers = [...roundMultipliers, multiplier]
    const totalRoundScore = newRoundScores.reduce((sum, s, index) => sum + s * newRoundMultipliers[index], 0)
    const newScore = currentPlayer.score - totalRoundScore

    // Add to current round throws
    setCurrentRoundThrows([
      ...currentRoundThrows,
      {
        baseScore,
        multiplier,
        totalScore: score,
      },
    ])

    // Decrease throws remaining
    setThrowsRemaining(throwsRemaining - 1)

    // Check if this throw would cause a bust
    if (newScore < 0 || newScore === 1) {
      setIsBust(true)
      setBustReason("Score cannot go below 0 or be exactly 1")
      return
    }

    // Check if this would be a finish (score = 0)
    if (newScore === 0) {
      // Check if the last throw was a double
      if (multiplier !== 2) {
        setIsBust(true)
        setBustReason("Must finish with a double")
        return
      }
    }
  }

  const finishRound = () => {
    if (!gameStarted || winner || roundScores.length === 0) return

    const currentPlayer = { ...players[currentPlayerIndex] }
    const totalRoundScore = roundScores.reduce((sum, score, index) => sum + score * roundMultipliers[index], 0)
    const newScore = currentPlayer.score - totalRoundScore

    // Handle bust (score below 0 or exactly 1)
    if (newScore < 0 || newScore === 1) {
      // Add the throws to the player's history even if they bust
      const throwsWithRound = currentRoundThrows.map((throwDetail) => ({
        ...throwDetail,
        roundNumber,
        remainingScore: currentPlayer.score, // Score doesn't change on bust
      }))

      currentPlayer.throwHistory = [...(currentPlayer.throwHistory || []), ...throwsWithRound]

      const updatedPlayers = [...players]
      updatedPlayers[currentPlayerIndex] = currentPlayer
      setPlayers(updatedPlayers)

      resetRoundAndNextPlayer()
      return
    }

    // Check if this is a finish (score = 0)
    if (newScore === 0) {
      // Check if the last throw was a double
      if (roundMultipliers[roundMultipliers.length - 1] !== 2) {
        setIsBust(true)
        setBustReason("Must finish with a double")
        return
      }

      // Add the throws to the player's history
      const throwsWithRound = currentRoundThrows.map((throwDetail, index) => {
        const previousThrows = currentRoundThrows.slice(0, index)
        const previousScore = previousThrows.reduce((sum, t) => sum + t.totalScore, 0)
        return {
          ...throwDetail,
          roundNumber,
          remainingScore: currentPlayer.score - previousScore,
        }
      })

      // Valid finish - update player score and set as winner
      currentPlayer.score = newScore
      currentPlayer.throws = [...currentPlayer.throws, ...roundScores]
      currentPlayer.throwHistory = [...(currentPlayer.throwHistory || []), ...throwsWithRound]

      const updatedPlayers = [...players]
      updatedPlayers[currentPlayerIndex] = currentPlayer
      setPlayers(updatedPlayers)

      setWinner(currentPlayer)
      setGameStarted(false)
      return
    }

    // Add the throws to the player's history
    const throwsWithRound = currentRoundThrows.map((throwDetail, index) => {
      const previousThrows = currentRoundThrows.slice(0, index)
      const previousScore = previousThrows.reduce((sum, t) => sum + t.totalScore, 0)
      return {
        ...throwDetail,
        roundNumber,
        remainingScore: currentPlayer.score - previousScore,
      }
    })

    // Regular score update
    currentPlayer.score = newScore
    currentPlayer.throws = [...currentPlayer.throws, ...roundScores]
    currentPlayer.throwHistory = [...(currentPlayer.throwHistory || []), ...throwsWithRound]

    const updatedPlayers = [...players]
    updatedPlayers[currentPlayerIndex] = currentPlayer
    setPlayers(updatedPlayers)

    // Move to next player
    nextPlayer()
  }

  const nextPlayer = () => {
    setThrowsRemaining(3)
    setRoundScores([])
    setRoundMultipliers([])
    setCurrentRoundThrows([])
    setIsBust(false)
    setBustReason("")

    // If we've gone through all players, increment the round number
    if (currentPlayerIndex === players.length - 1) {
      setRoundNumber(roundNumber + 1)
    }

    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length)
  }

  const resetRound = () => {
    setThrowsRemaining(3)
    setRoundScores([])
    setRoundMultipliers([])
    setCurrentRoundThrows([])
    setIsBust(false)
    setBustReason("")
  }

  // Combined function to reset round and move to next player
  const resetRoundAndNextPlayer = () => {
    resetRound()

    // If we've gone through all players, increment the round number
    if (currentPlayerIndex === players.length - 1) {
      setRoundNumber(roundNumber + 1)
    }

    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length)
  }

  const updatePlayerScore = (playerId: string, newScore: number) => {
    const updatedPlayers = players.map((player) => (player.id === playerId ? { ...player, score: newScore } : player))
    setPlayers(updatedPlayers)
    setPlayerToEdit(null)
  }

  // Calculate if current round would result in negative points
  const currentPlayer = players[currentPlayerIndex]
  const totalRoundScore = roundScores.reduce((sum, score, index) => sum + score * roundMultipliers[index], 0)
  const potentialRemainingScore = currentPlayer ? currentPlayer.score - totalRoundScore : 0

  // Check if would bust
  const wouldBust =
    potentialRemainingScore === 1 ||
    potentialRemainingScore < 0 ||
    (potentialRemainingScore === 0 &&
      (roundMultipliers.length === 0 || roundMultipliers[roundMultipliers.length - 1] !== 2))

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
      <div className="flex justify-between items-center p-4 bg-background/90 backdrop-blur-sm sticky top-0 z-10 border-b">
        <h1 className="text-3xl font-bold">
          🎯 Darts Game <span className="text-xl font-normal">(Double Out)</span>
        </h1>
        <div className="flex items-center space-x-2">
          {gameStarted && (
            <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => setHistorySheetOpen(true)}>
              <History className="h-6 w-6" />
            </Button>
          )}
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Settings className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[90%] sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="text-2xl">Game Setup</SheetTitle>
                <SheetDescription className="text-lg">Configure players and game mode</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
                <PlayerManagement players={players} setPlayers={setPlayers} disabled={gameStarted} />

                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Game Mode</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["301", "501", "701"].map((mode) => (
                      <Button
                        key={mode}
                        variant={gameMode === mode ? "default" : "outline"}
                        className="text-xl py-6"
                        onClick={() => setGameMode(mode as GameMode)}
                        disabled={gameStarted}
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                </div>

                <ColorSettings
                  multiplierColors={multiplierColors}
                  setMultiplierColors={setMultiplierColors}
                  disabled={gameStarted}
                />

                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Game Controls</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={startGame} disabled={players.length < 1 || gameStarted} className="text-xl py-6">
                      {gameStarted ? "Game in Progress" : "Start Game"}
                    </Button>

                    <Button
                      onClick={quickResetGame}
                      disabled={players.length < 1}
                      className="text-xl py-6 flex items-center justify-center"
                      variant="outline"
                    >
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Quick Reset
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex-1 p-2 flex flex-col">
        {gameStarted ? (
          <div className="space-y-4 flex-1 flex flex-col max-w-4xl mx-auto w-full">
            <div className="pt-6 mb-8">
              <GameStats
                players={players}
                currentPlayerIndex={currentPlayerIndex}
                throwsRemaining={throwsRemaining}
                roundScores={roundScores}
                roundMultipliers={roundMultipliers}
                gameMode={gameMode}
                onEditPlayer={setPlayerToEdit}
                isBust={isBust}
                bustReason={bustReason}
                potentialRemainingScore={potentialRemainingScore}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 my-6">
              <Button
                size="lg"
                onClick={resetRound}
                className="text-xl py-8 flex items-center justify-center"
                variant="outline"
              >
                <RotateCcw className="mr-2 h-6 w-6" />
                Reset Round
              </Button>

              {roundScores.length === 0 ? (
                <Button
                  size="lg"
                  onClick={nextPlayer}
                  className="text-xl py-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowRight className="mr-2 h-6 w-6" />
                  Next Player
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={isBust || wouldBust ? resetRoundAndNextPlayer : finishRound}
                  className={`text-xl py-8 flex items-center justify-center ${
                    isBust || wouldBust ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isBust || wouldBust ? (
                    <>
                      <XCircle className="mr-2 h-6 w-6" />
                      Bust!
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-6 w-6" />
                      Finish Round
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              <ScoreInput
                onScore={handleScore}
                disabled={!gameStarted || throwsRemaining <= 0 || winner !== null || isBust}
                multiplier={multiplier}
                setMultiplier={setMultiplier}
                isBust={isBust}
                multiplierColors={multiplierColors}
              />
            </div>
          </div>
        ) : winner ? (
          <div className="text-center py-8 max-w-md mx-auto flex-1 flex flex-col justify-center">
            <div className="animate-bounce text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold mb-4">Winner!</h2>
            <p className="text-3xl mb-8">{winner.name} has won the game!</p>
            <div className="flex flex-col space-y-4">
              <Button onClick={startGame} size="lg" className="text-2xl py-8 px-8 mx-auto">
                Play Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-xl py-6 flex items-center justify-center"
                onClick={() => setHistorySheetOpen(true)}
              >
                <History className="mr-2 h-5 w-5" />
                View Game History
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 max-w-md mx-auto flex-1 flex flex-col justify-center">
            <div className="text-7xl mb-6">🎯</div>
            <p className="text-2xl text-muted-foreground mb-8">
              Open the settings to add players and select a game mode
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="text-2xl py-8 px-8 mx-auto">
                  Game Setup
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[90%] sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="text-2xl">Game Setup</SheetTitle>
                  <SheetDescription className="text-lg">Configure players and game mode</SheetDescription>
                </SheetHeader>
                <div className="space-y-6 py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
                  <PlayerManagement players={players} setPlayers={setPlayers} disabled={gameStarted} />

                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Game Mode</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {["301", "501", "701"].map((mode) => (
                        <Button
                          key={mode}
                          variant={gameMode === mode ? "default" : "outline"}
                          className="text-xl py-6"
                          onClick={() => setGameMode(mode as GameMode)}
                          disabled={gameStarted}
                        >
                          {mode}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <ColorSettings
                    multiplierColors={multiplierColors}
                    setMultiplierColors={setMultiplierColors}
                    disabled={gameStarted}
                  />

                  <Button onClick={startGame} disabled={players.length < 1} className="w-full text-xl py-6">
                    Start Game
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>

      {/* Game History Sheet */}
      <GameHistorySheet
        open={historySheetOpen}
        onOpenChange={setHistorySheetOpen}
        players={players}
        multiplierColors={multiplierColors}
      />

      {playerToEdit && (
        <EditScoreDialog player={playerToEdit} onSave={updatePlayerScore} onCancel={() => setPlayerToEdit(null)} />
      )}
    </div>
  )
}
