'use client'
import '@/app/globals.css';
import { Player, Song, useGameplayStore } from "@/stores/hitsterModelStore";
import { demoPlayers } from "@/stores/demoPlayers";
import { demoPlaylist } from "@/stores/demoPlaylist";
import GameplayView from '@/views/GameplayView';

export default function GameplayPresenter() {
    const { seatPlayersInRandomOrder, setPlaylist, playRandomNewSongFromCurrentPlaylist, stopPlayer, goToNextPlayer, addCardToPlayersDeck,
            currentPlayers, currentPlayerId, currentPlaylist, currentSongId, isAudioPlayerRunning } = useGameplayStore();

    const unheardSongs = currentPlaylist?.filter((song: Song) => !song.hasBeenPlayed)

    const getSongTitleById = (songId: string) => {
        const song = currentPlaylist?.find((song: Song) => song.id === songId);
        return song ? song.title : null; // Return the song title or null if not found
    }
    const currentSongTitle = getSongTitleById(currentSongId)

    const getSongYearById = (songId: string) => {
        const song = currentPlaylist?.find((song: Song) => song.id === songId);
        return song ? song.year : null; // Return the song title or null if not found
    }
    const currentSongYear = getSongYearById(currentSongId)

    function handleAddDemoPlayersClick(evt: any) {
        seatPlayersInRandomOrder(demoPlayers)
    }

    function handleAddDemoPlaylistClick(evt: any) {
        setPlaylist(demoPlaylist)
    }

    function handlePlayClick(evt: any) {
        playRandomNewSongFromCurrentPlaylist()
    }

    function handleStopClick(evt: any) {
        stopPlayer()
    }

    function handleRightGuessClick(evt: any) {
        stopPlayer()  // a player is so sure they just place and click guess
	addCardToPlayersDeck()
        goToNextPlayer()
    }

    function handleWrongGuessClick(evt: any) {
        stopPlayer()  // maybe a player wants to give up on guessing
        goToNextPlayer()
    }

    return (
      <GameplayView />
    )

    return (
        <div>
            <h1>Gameplay</h1>
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
        </div>
    )
}
