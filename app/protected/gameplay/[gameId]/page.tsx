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
    const { playRandomNewSongFromCurrentPlaylist, startPlayer, stopPlayer, goToNextPlayer, addCardToPlayersDeck, 
            setCurrentSongId, pauseGame, resumeGame, restartGame,
            currentPlayers, currentPlayerId, currentPlaylist, currentSongId, gameSettings, isAudioPlayerRunning } = useGameplayStore();
    
    // Use the persistence hook to load and save game state
    const { isLoading, error } = useHitsterPersistence(unwrappedParams.gameId);
    useGameOverEffect(unwrappedParams.gameId);

    function onStopPlayerClick() {
        stopPlayer()
    }

    function onStartPlayerClick() {
        startPlayer()
    }

    function onCardSelect() {
        playRandomNewSongFromCurrentPlaylist()
    }

    function onCorrectPlacement() {
        addCardToPlayersDeck()
        setCurrentSongId(null)
    }

    function onIncorrectPlacement() {
        setCurrentSongId(null)
    }

    function onNextPlayerClick() {
        goToNextPlayer()
    }

    function onPauseGameClick() {
        pauseGame()
    }

    function onRestartGameClick() {
        restartGame()
    }

    function onResumeGameClick() {
        resumeGame()
    }

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
            onStartPlayerClick={onStartPlayerClick}
            onStopPlayerClick={onStopPlayerClick}
            onCardSelect={onCardSelect}
            onNextPlayerClick={onNextPlayerClick}
            onCorrectPlacement={onCorrectPlacement}
            onIncorrectPlacement={onIncorrectPlacement}
            onPauseGameClick={onPauseGameClick}
            onRestartGameClick={onRestartGameClick}
            onResumeGameClick={onResumeGameClick}
        />
    )
} 