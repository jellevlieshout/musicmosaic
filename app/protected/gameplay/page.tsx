'use client'
import '@/app/globals.css';
import { Player, useGameplayStore } from "@/stores/hitsterModelStore";
import { demoPlayers } from "@/stores/demoPlayers";
import { demoPlaylist } from "@/stores/demoPlaylist";

export default function GameplayPage() {
    const { seatPlayersInRandomOrder, setPlaylist, playRandomNewSongFromCurrentPlaylist, stopPlayer,
            currentPlayers, currentPlayerId, currentPlaylist, currentSongId, isAudioPlayerRunning } = useGameplayStore();



    const unheardSongs = currentPlaylist?.filter((song: Song) => !song.hasBeenPlayed)

    // const isPlayerRunning = false

    function handleAddDemoPlayersClick(evt) {
        seatPlayersInRandomOrder(demoPlayers)
    }

    function handleAddDemoPlaylistClick(evt) {
        setPlaylist(demoPlaylist)
    }

    function handlePlayClick(evt) {
        playRandomNewSongFromCurrentPlaylist()
    }

    function handleStopClick(evt) {
        stopPlayer()
    }


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
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Music Player</h2>
		<div>
                <button className="neon-tubes-styling" onClick={handlePlayClick} style={{margin: '20px'}} type="button">Play</button>
                <button className="neon-tubes-styling" onClick={handleStopClick} style={{margin: '20px'}} type="button">Stop</button>
		</div>
		    {isAudioPlayerRunning && currentSongId && (
                        <div>
		            We are playing the song with ID {currentSongId}.
			</div>
		    )}
            </div>
        </div>
    )
}
