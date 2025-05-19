"use client";

import { useState, useCallback, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PlayerSelectionView from "@/views/PlayerSelectionView";
import { useGameplayStore} from '@/stores/hitsterModelStore';
import { Player } from '@/utils/types';
import { v4 as uuidv4 } from 'uuid';
import { useHitsterPersistence } from '@/hooks/useHitsterPersistence';


function PlayerSelectionContent() {
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);
  const searchParams = useSearchParams();
  const gameIdParam = searchParams.get('gameId');
  const { gameId } = useHitsterPersistence(gameIdParam);
  
  // Get game state functions from the store
  const { seatPlayersInRandomOrder, currentPlayers, gameHasStarted } = useGameplayStore();

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
        id: uuidv4(),
        name: name.trim(),
        highestScore: null,
        deck: [],
      }));

    // Save players to the store - IDs will be assigned by the backend
    seatPlayersInRandomOrder(players);

    // Navigate to game settings
    router.push(`/protected/new-game/settings?gameId=${gameId}`);
  };

  return (
    <PlayerSelectionView
      gameId={gameId}
      currentPlayers={currentPlayers?.map((p) => p.name)}
      onSubmit={handleSubmit}
      onValidate={validatePlayers}
      isFormValid={isFormValid}
      gameStarted={gameHasStarted}
    />
  );
}

export default function PlayerSelectionPresenter() {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <PlayerSelectionContent />
    </Suspense>
  );
} 