'use client'
import '@/app/globals.css';
import { Player, Song, useGameplayStore } from "@/stores/hitsterModelStore";
import { useHitsterPersistence } from "@/hooks/useHitsterPersistence";
import { useState } from "react";
import { demoPlayers } from "@/stores/demoPlayers";
import { demoPlaylist } from "@/stores/demoPlaylist";

export default function GameplayPage() {
    const { seatPlayersInRandomOrder, setPlaylist, playRandomNewSongFromCurrentPlaylist, stopPlayer, goToNextPlayer, addCardToPlayersDeck,
            currentPlayers, currentPlayerId, currentPlaylist, currentSongId, isAudioPlayerRunning } = useGameplayStore();
    
    // Generate a unique game ID for this session
    const [gameId] = useState(() => {
        // Use a timestamp as a simple way to generate a unique ID
        return `game_${Date.now()}`;
    });
    
    // Use the persistence hook to load and save game state
    const { isLoading, error } = useHitsterPersistence(gameId);

    const unheardSongs = currentPlaylist?.filter((song: Song) => !song.hasBeenPlayed)

    const getSongTitleById = (songId: string | null) => {
        if (!songId) return null;
        const song = currentPlaylist?.find((song: Song) => song.id === songId);
        return song ? song.title : null; // Return the song title or null if not found
    }
    const currentSongTitle = getSongTitleById(currentSongId)

    const getSongYearById = (songId: string | null) => {
        if (!songId) return null;
        const song = currentPlaylist?.find((song: Song) => song.id === songId);
        return song ? song.year : null; // Return the song title or null if not found
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
        stopPlayer()  // a player is so sure they just place and click guess
	addCardToPlayersDeck()
        goToNextPlayer()
    }

    function handleWrongGuessClick(evt: React.MouseEvent<HTMLButtonElement>) {
        stopPlayer()  // maybe a player wants to give up on guessing
        goToNextPlayer()
    }

    return (
        <div>
            <h1>Gameplay</h1>
            {isLoading && <div>Loading game state...</div>}
            {error && <div className="error">Error: {error}</div>}
            <div>
                <h2>Current Playlist</h2>
                <div>
                    <button className="neon-tubes-styling" onClick={handleAddDemoPlaylistClick} type="button">Add demo playlist</button>
                </div>
                    {currentPlaylist && currentPlaylist.length > 0 && (
                     <div>
                         Loaded a playlist with {currentPlaylist.length} {currentPlaylist.length === 1 ? 'song' : 'songs'}
                     </div>
                    )}
                    {unheardSongs && (
                     <div>
                         {unheardSongs.length} {unheardSongs.length === 1 ? 'Song' : 'Songs'} left to play
                     </div>
                    )}
            </div>
            <div>
                <h2>Current Players</h2>
                <button className="neon-tubes-styling" onClick={handleAddDemoPlayersClick} type="button">Add demo players</button>
                <ul>
                    {currentPlayers?.map((player: Player) => (
                        <li key={player.id} style={{ fontWeight: player.id === currentPlayerId ? 'bold' : 'normal' }}>
                            {player.name}
                            {player.deck && player.deck.length > 0 && (
                                <ul>
                                    {player.deck.map((song: Song) => (
                                        <li key={song.id}>{song.year}, {song.title}</li>
                                    ))}
                                </ul>
			    )}
                        </li>
                    ))}
                </ul>
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
                        <button className="neon-tubes-styling" onClick={handleRightGuessClick} style={{margin: '20px'}} type="button">Right Guess</button>
                        <button className="neon-tubes-styling" onClick={handleWrongGuessClick} style={{margin: '20px'}} type="button">Wrong Guess</button>
                    </div>
                )}
            </div>
        </div>
    )
}
