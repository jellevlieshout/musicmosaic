"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface PlayerSelectionViewProps {
  onSubmit: (players: string[]) => void;
  onValidate: (players: string[]) => void;
  isFormValid: boolean;
  gameStarted: boolean;
}

export default function PlayerSelectionView({
  gameStarted,
  onSubmit,
  onValidate,
  isFormValid
}: PlayerSelectionViewProps) {
  const [players, setPlayers] = useState<string[]>(["", "", ""]);  // Default 3 players

  useEffect(() => {
    onValidate(players);
  }, [players, onValidate]);

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    setPlayers([...players, ""]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= 1) return; // Prevent removing all players
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  const handleSubmit = () => {
    onSubmit(players.filter(player => player.trim() !== ""));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="neon-tubes-styling text-5xl mb-8 text-center">NEW GAME</h1>
      <h2 className="neon-tubes-styling text-2xl mb-6 text-center">SELECT PLAYERS</h2>
      
      <div className="space-y-4">
        {players.map((player, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              disabled={gameStarted}
              placeholder={`Player ${index + 1}`}
              value={player}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
              className="neon-glow-box-shadow"
            />
            {players.length > 1 && (
              <Button
                disabled={gameStarted}
                variant="ghost"
                size="icon"
                onClick={() => removePlayer(index)}
                className="hover:bg-destructive/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addPlayer}
          className="w-full neon-glow-box-shadow"
          disabled={gameStarted}
        >
          Add player
        </Button>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="neon-glow-box-shadow"
          >
            ← Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`${isFormValid ? 'text-black' : 'opacity-50'}`}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
} 