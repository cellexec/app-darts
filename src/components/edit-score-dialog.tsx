"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Player } from "./darts-game"

interface EditScoreDialogProps {
  player: Player
  onSave: (playerId: string, newScore: number) => void
  onCancel: () => void
}

export default function EditScoreDialog({ player, onSave, onCancel }: EditScoreDialogProps) {
  const [score, setScore] = useState(player.score.toString())
  const [isOpen, setIsOpen] = useState(true)

  const handleSave = () => {
    const newScore = Number.parseInt(score)
    if (!isNaN(newScore) && newScore >= 0) {
      onSave(player.id, newScore)
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    onCancel()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Player Score</DialogTitle>
          <DialogDescription className="text-lg">Manually adjust the score for {player.name}</DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <Label htmlFor="score" className="text-xl mb-2 block">
            Score
          </Label>
          <Input
            id="score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="text-2xl py-6"
            type="number"
            min="0"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} className="text-xl py-6">
            Cancel
          </Button>
          <Button onClick={handleSave} className="text-xl py-6">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
