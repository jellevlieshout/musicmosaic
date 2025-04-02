// npm install zustand
import { create } from 'zustand' // used to create stores (store = place where u store state & state modifying functions)

/**
 * Define types since we're working in typescript
 */

type Song = {
    id: string
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
    // revealSongDetails: () => void
    // playerWasRight: () => void
    // playerWasWrong: () => void
}

export const useGameplayStore = create<GameplayState>((set, get) => ({
    currentPlayers: null,
    currentPlayerId: null,
    currentPlaylist: null,
    currentSongId: null,

    setPlaylist: (playlist: Song[]) => {
        function addHasBeenPlayedField(song: Song): Song {
            return { ...song, hasBeenPlayed: false }
        }
        const updatedPlaylist = playlist.map(addHasBeenPlayedField)
        set({ currentPlaylist: updatedPlaylist })
    },

    seatPlayersInRandomOrder: (players: Player[]) => {
        const shuffled = players
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        set({ currentPlayers: shuffled, currentPlayerId: shuffled[0]?.id ?? null })
    },

    playRandomNewSongFromCurrentPlaylist: () => {
        const { currentPlaylist } = get()
        if (!currentPlaylist) 
            return
        const unheardSongs = currentPlaylist.filter(song => !song.hasBeenPlayed)
        if (unheardSongs.length === 0) {
            console.log("We ran out of new songs!")
            return
        }

        const randomSong = unheardSongs[Math.floor(Math.random() * unheardSongs.length)]
        const updatedPlaylist = currentPlaylist.map(song =>
            song.id === randomSong.id ? { ...song, hasBeenPlayed: true } : song
        )

        const { currentPlayers, currentPlayerId } = get()
        const player = currentPlayers?.find(p => p.id === currentPlayerId)

        console.log(`${player?.name}'s time to shine!`)
        player?.deck.forEach(song => console.log(song.year, song.title))
        console.log("Playing", randomSong.title)

        set({ currentPlaylist: updatedPlaylist, currentSongId: Number(randomSong.id) })
    }
}))
