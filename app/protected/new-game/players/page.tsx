"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PlayerSelectionView from "@/views/PlayerSelectionView";
import { useGameplayStore} from '@/stores/hitsterModelStore';
import { Player } from '@/utils/types';
import { v4 as uuidv4 } from 'uuid';

function PlayerSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');
  const [isFormValid, setIsFormValid] = useState(false);

  // Get game state functions from the store
  const { seatPlayersInRandomOrder, pickRandomNewSong, addCardToPlayersDeck, goToNextPlayer } = useGameplayStore();

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
        deck: []
      }));

    // Save players to the store - IDs will be assigned by the backend
    seatPlayersInRandomOrder(players);

    // initialize players decks with one card
    players.forEach(() => {
        pickRandomNewSong()
        addCardToPlayersDeck()
        goToNextPlayer()
    })

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

export default function PlayerSelectionPresenter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayerSelectionContent />
    </Suspense>
  );
} 