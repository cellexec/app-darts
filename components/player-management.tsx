"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, X, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Player } from "@/components/darts-game"

interface PlayerManagementProps {
  players: Player[]
  setPlayers: (players: Player[]) => void
  disabled?: boolean
}

export default function PlayerManagement({ players, setPlayers, disabled = false }: PlayerManagementProps) {
  const [newPlayerName, setNewPlayerName] = useState("")

  // Function to capitalize each word in a string
  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const addPlayer = () => {
    if (!newPlayerName.trim()) return

    const capitalizedName = capitalizeWords(newPlayerName.trim())

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: capitalizedName,
      score: 0,
      throws: [],
    }

    setPlayers([...players, newPlayer])
    setNewPlayerName("")
  }

  const removePlayer = (id: string) => {
    setPlayers(players.filter((player) => player.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPlayer()
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium flex items-center">
        <Users className="mr-2 h-6 w-6" />
        Players
      </h3>

      <div className="flex space-x-2">
        <Input
          placeholder="Add player"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="text-xl py-6"
        />
        <Button size="icon" onClick={addPlayer} disabled={!newPlayerName.trim() || disabled} className="h-14 w-14">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div>

      <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
        {players.length === 0 ? (
          <p className="text-lg text-muted-foreground py-2">No players added yet</p>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between bg-muted p-4 rounded-md hover:bg-muted/80 transition-colors"
            >
              <span className="font-medium text-xl">{player.name}</span>
              {!disabled && (
                <Button variant="ghost" size="icon" onClick={() => removePlayer(player.id)} className="h-10 w-10">
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
