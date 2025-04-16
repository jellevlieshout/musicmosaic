'use client'
import '@/app/globals.css';
import { useGameplayStore } from "@/stores/hitsterModelStore";
import { useHitsterPersistence } from "@/hooks/useHitsterPersistence";
import * as React from 'react';
import GameplayView from '@/views/GameplayView';
import { useGameOverEffect } from "@/hooks/useGameOverEffect";


interface GameplayPageProps {
  params: Promise<{
    gameId: string;
  }>;
}

export default function GameplayPresenter({ params }: GameplayPageProps) {
    const unwrappedParams = React.use(params);
    const { playRandomNewSongFromCurrentPlaylist, startPlayer, stopPlayer, goToNextPlayer, addCardToPlayersDeck, setCurrentSongId,
            currentPlayers, currentPlayerId, currentPlaylist, currentSongId, gameSettings, isAudioPlayerRunning } = useGameplayStore();
    
    // Use the persistence hook to load and save game state
    const { isLoading, error } = useHitsterPersistence(unwrappedParams.gameId);
    useGameOverEffect(unwrappedParams.gameId);

    return (
        <GameplayView 
            currentPlayers={currentPlayers} 
            currentPlayerId={currentPlayerId} 
            currentPlaylist={currentPlaylist}
            currentSongId={currentSongId}
            gameSettings={gameSettings}
            isAudioPlayerRunning={isAudioPlayerRunning}
            isLoading={isLoading}
            error={error}
            startPlayer={startPlayer}
            stopPlayer={stopPlayer}
            addCardToPlayersDeck={addCardToPlayersDeck}
            goToNextPlayer={goToNextPlayer}
            playRandomNewSongFromCurrentPlaylist={playRandomNewSongFromCurrentPlaylist}
            setCurrentSongId={setCurrentSongId}
        />
    )
} 