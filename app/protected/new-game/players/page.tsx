"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PlayerSelectionView from "@/views/PlayerSelectionView";
import { useGameplayStore, type Player } from '@/stores/hitsterModelStore';

export default function PlayerSelectionPresenter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');
  const [isFormValid, setIsFormValid] = useState(false);

  // Get the seatPlayersInRandomOrder function from the store
  const seatPlayersInRandomOrder = useGameplayStore((state) => state.seatPlayersInRandomOrder);

  const validatePlayers = useCallback((players: string[]) => {
    // At least one player with a non-empty name
    const validPlayers = players.filter(name => name.trim() !== "");
    setIsFormValid(validPlayers.length > 0);
  }, []);

  const handleSubmit = (playerNames: string[]) => {
    if (!gameId || !isFormValid) return;

    // Create Player objects from names
    const players: Player[] = playerNames
      .filter(name => name.trim() !== "")
      .map(name => ({
        name: name.trim(),
        highestScore: null,
        deck: []
      }));

    // Save players to the store - IDs will be assigned by the backend
    seatPlayersInRandomOrder(players);

    // Navigate to gameplay
    router.push(`/protected/gameplay/${gameId}`);
  };

  return (
    <PlayerSelectionView
      onSubmit={handleSubmit}
      onValidate={validatePlayers}
      isFormValid={isFormValid}
    />
  );
} 