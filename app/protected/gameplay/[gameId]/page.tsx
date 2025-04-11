'use client'
import '@/app/globals.css';
import { Player, Song, useGameplayStore } from "@/stores/hitsterModelStore";
import { useHitsterPersistence } from "@/hooks/useHitsterPersistence";
import { useState } from "react";
import { demoPlayers } from "@/stores/demoPlayers";
import { demoPlaylist } from "@/stores/demoPlaylist";
import * as React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GameplayPageProps {
  params: Promise<{
    gameId: string;
  }>;
}

export default function GameplayPage({ params }: GameplayPageProps) {
    const unwrappedParams = React.use(params);
    const { seatPlayersInRandomOrder, setPlaylist, playRandomNewSongFromCurrentPlaylist, stopPlayer, goToNextPlayer, addCardToPlayersDeck,
            currentPlayers, currentPlayerId, currentPlaylist, currentSongId, isAudioPlayerRunning } = useGameplayStore();
    
    // Use the persistence hook to load and save game state
    const { isLoading, error } = useHitsterPersistence(unwrappedParams.gameId);
    const [isDemoMode, setIsDemoMode] = useState(false);

    const unheardSongs = currentPlaylist?.filter((song: Song) => !song.hasBeenPlayed)

    const getSongTitleById = (songId: string | null) => {
        if (!songId) return null;
        const song = currentPlaylist?.find((song: Song) => song.id === songId);
        return song ? song.title : null;
    }
    const currentSongTitle = getSongTitleById(currentSongId)

    const getSongYearById = (songId: string | null) => {
        if (!songId) return null;
        const song = currentPlaylist?.find((song: Song) => song.id === songId);
        return song ? song.year : null;
    }
    const currentSongYear = getSongYearById(currentSongId)

    function handleAddDemoPlayersClick(evt: React.MouseEvent<HTMLButtonElement>) {
        seatPlayersInRandomOrder(demoPlayers)
    }

    function handleAddDemoPlaylistClick(evt: React.MouseEvent<HTMLButtonElement>) {
        setPlaylist(demoPlaylist)
    }

    function handlePlayClick(evt: React.MouseEvent<HTMLButtonElement>) {
        playRandomNewSongFromCurrentPlaylist()
    }

    function handleStopClick(evt: React.MouseEvent<HTMLButtonElement>) {
        stopPlayer()
    }

    function handleRightGuessClick(evt: React.MouseEvent<HTMLButtonElement>) {
        addCardToPlayersDeck()
        goToNextPlayer()
    }

    function handleWrongGuessClick(evt: React.MouseEvent<HTMLButtonElement>) {
        goToNextPlayer()
    }

    if (isLoading) {
        return <div>Loading game...</div>;
    }

    if (error) {
        return <div>Error loading game: {error}</div>;
    }

    return (
        <div>
            <h1>Gameplay</h1>
            <div>
                <h2>Game ID: {unwrappedParams.gameId}</h2>
                <div className="flex items-center justify-between max-w-xs mx-auto mb-4">
                    <Label className="neon-tubes-styling">Demo Mode</Label>
                    <Switch
                        checked={isDemoMode}
                        onCheckedChange={setIsDemoMode}
                    />
                </div>
                {isDemoMode && (
                    <>
                        <button className="neon-tubes-styling" onClick={handleAddDemoPlayersClick} style={{margin: '20px'}} type="button">Add demo players</button>
                        <button className="neon-tubes-styling" onClick={handleAddDemoPlaylistClick} style={{margin: '20px'}} type="button">Add demo playlist</button>
                    </>
                )}
            </div>
            <div>
                <h2>Music Player</h2>
                <div>
                    <button className="neon-tubes-styling" onClick={handlePlayClick} style={{margin: '20px'}} type="button">Play</button>
                    <button className="neon-tubes-styling" onClick={handleStopClick} style={{margin: '20px'}} type="button">Stop & Reveal</button>
                </div>
                {isAudioPlayerRunning && currentSongId && currentSongTitle && (
                    <div>
                        We are playing the song with ID {currentSongId}, {currentSongTitle}
                    </div>
                )}
                {!isAudioPlayerRunning && (
                    <div>
                        Year of {currentSongTitle} was {currentSongYear}
                    </div>
                )}
            </div>
            <div>
                <h2>Guessing</h2>
                <div>
                    <button className="neon-tubes-styling" onClick={handleRightGuessClick} style={{margin: '20px'}} type="button">Right guess</button>
                    <button className="neon-tubes-styling" onClick={handleWrongGuessClick} style={{margin: '20px'}} type="button">Wrong guess</button>
                </div>
            </div>
            <div>
                <h2>Players</h2>
                <div>
                    {currentPlayers?.map((player: Player) => (
                        <div 
                            key={player.id} 
                            style={{
                                padding: '10px',
                                margin: '5px',
                                backgroundColor: player.id === currentPlayerId ? '#4CAF50' : '#333',
                                color: 'white',
                                borderRadius: '5px'
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>{player.name}</div>
                            <div style={{ marginTop: '5px', fontSize: '0.9em' }}>
                                Deck: {player.deck.length} cards
                                {player.deck.length > 0 && (
                                    <div style={{ marginTop: '5px' }}>
                                        {player.deck.map((card, index) => (
                                            <span 
                                                key={index}
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '2px 6px',
                                                    margin: '2px',
                                                    backgroundColor: '#555',
                                                    borderRadius: '3px',
                                                    fontSize: '0.8em'
                                                }}
                                            >
                                                {card.title} ({card.year})
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 