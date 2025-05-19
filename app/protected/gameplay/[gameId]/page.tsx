'use client'
import '@/app/globals.css';
import { useGameplayStore } from "@/stores/hitsterModelStore";
import { useHitsterPersistence } from "@/hooks/useHitsterPersistence";
import * as React from 'react';
import GameplayView from '@/views/GameplayView';
import { useGameOverEffect } from "@/hooks/useGameOverEffect";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Song } from '@/utils/types';

interface GameplayPageProps {
  params: Promise<{
    gameId: string;
  }>;
}

export default function GameplayPresenter({ params }: GameplayPageProps) {
    const unwrappedParams = React.use(params);
    const router = useRouter();
    const { playRandomNewSongFromCurrentPlaylist, startPlayer, stopPlayer, goToNextPlayer, addCardToPlayersDeck, 
            setCurrentSongId, pauseGame, resumeGame, restartGame,
            currentPlayers, currentPlayerId, currentPlaylist, currentSongId, gameSettings, isAudioPlayerRunning } = useGameplayStore();
    
    // Use the persistence hook to load and save game state
    const { isLoading, error } = useHitsterPersistence(unwrappedParams.gameId);
    useGameOverEffect(unwrappedParams.gameId);

    const [showOutOfSongsDialog, setShowOutOfSongsDialog] = React.useState(false);

    React.useEffect(() => {
        console.log("useEffect triggered");
        console.log("currentSongId:", currentSongId);
        console.log("currentPlaylist:", currentPlaylist);
        console.log("currentPlaylist length:", currentPlaylist?.length);
        
        // Check if we have no songs left (either playlist is empty or null)
        const noCurrentSong = !currentSongId;
        
        console.log("noCurrentSong:", noCurrentSong);
        
        if (noCurrentSong && currentPlaylist?.filter((song: Song) => !song.hasBeenPlayed).length === 0) {
            console.log("Condition met - showing dialog");
            toast.error('You have run out of songs! The game cannot be continued.', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#333',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '8px',
                },
            });
            setShowOutOfSongsDialog(true);
        }
    }, [currentSongId, currentPlaylist]);

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

    function onQuitGame() {
        router.push('/protected/home');
    }

    return (
        <>
            <Toaster />
            <Dialog open={showOutOfSongsDialog} onOpenChange={setShowOutOfSongsDialog}>
                <DialogContent className="max-w-[300px] text-center">
                    <DialogHeader>
                        <DialogTitle className="neon-tubes-styling text-2xl">
                            Out of Songs
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4">
                        <p>You have run out of songs! The game cannot be continued.</p>
                        <Button variant="destructive" onClick={onQuitGame}>
                            Return to Home
                        </Button>
                    </div>
                    <DialogFooter />
                </DialogContent>
            </Dialog>
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
        </>
    )
} 