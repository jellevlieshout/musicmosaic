'use client'
import { Player, useGameplayStore } from "@/stores/hitsterModelStore";
import { demoPlayers } from "@/stores/demoPlayers";

export default function GameplayPage() {
    const { seatPlayersInRandomOrder, currentPlayers, currentPlayerId, currentPlaylist, currentSongId } = useGameplayStore();

    function handleAddDemoPlayersClick(evt) {
        seatPlayersInRandomOrder(demoPlayers)
    }

    return (
        <div>
            <h1>Gameplay</h1>
            <div>
                <h2>Current Players</h2>
                <ul>
                    {currentPlayers?.map((player: Player) => (
                        <li key={player.id} style={{ fontWeight: player.id === currentPlayerId ? 'bold' : 'normal' }}>
                            {player.name}
                        </li>
                    ))}
                </ul>
            </div>
	    <div>
		<button onClick={handleAddDemoPlayersClick} type="button">Add demo players</button>
	    </div>
        </div>
    )
}