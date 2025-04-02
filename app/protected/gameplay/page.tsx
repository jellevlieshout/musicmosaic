'use client'
import { useGameplayStore } from "@/stores/hitsterModelStore";

export default function GameplayPage() {
    const { currentPlayers, currentPlayerId, currentPlaylist, currentSongId } = useGameplayStore();
    return (
        <div>
            <h1>Gameplay</h1>
            <div>
                <h2>Current Players</h2>
                <ul>
                    {currentPlayers?.map((player: Player) => (
                        <li key={player.id}>{player.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}