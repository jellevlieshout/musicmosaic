// npm install zustand
import { create } from 'zustand' // used to create stores (store = place where u store state & state modifying functions)

/**
 * Define types since we're working in typescript
 */

type Song = {
    id: number
    title: string
    artist: string
    album: string
    year: number
    hasBeenPlayed?: boolean
}

type Player = {
    id: number
    name: string
    highestScore: number | null
    deck: Song[]
}

type GameplayState = {
    currentPlayers: Player[] | null
    currentPlayerId: number | null
    currentPlaylist: Song[] | null
    currentSongId: number | null

    setPlaylist: (playlist: Song[]) => void
    seatPlayersInRandomOrder: (players: Player[]) => void
    playRandomNewSongFromCurrentPlaylist: () => void
    revealSongDetails: () => void
    playerWasRight: () => void
    playerWasWrong: () => void
}

export const useGameplayStore = create<GameplayState>()(set, get) => ({
    currentPlayers: null,
    currentPlayerId: null,
    currentPlaylist: null,
    currentSongId: null,
})

