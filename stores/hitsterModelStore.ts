// npm install zustand
import { create } from 'zustand' // used to create stores (store = place where u store state & state modifying functions)
import { subscribeWithSelector } from 'zustand/middleware'
import { upsertPlayers } from '@/utils/supabase/supabaseModel'
/**
 * Define types since we're working in typescript
 */

export type Song = {
    id: string
    title: string
    artist: string
    album: string
    year: number
    hasBeenPlayed?: boolean
}

export type Player = {
    id: string
    name: string
    highestScore: number | null
    deck: Song[]
}

export type GameplayState = {
    currentPlayers: Player[] | null
    currentPlayerId: string | null
    currentPlaylist: Song[] | null
    currentSongId: string | null
    isAudioPlayerRunning?: boolean

    setPlaylist: (playlist: Song[]) => void
    seatPlayersInRandomOrder: (players: Player[]) => void
    playRandomNewSongFromCurrentPlaylist: () => void
    stopPlayer: () => void
    goToNextPlayer: () => void
    addCardToPlayersDeck: () => void
    // revealSongDetails: () => void
    // playerWasRight: () => void
    // playerWasWrong: () => void
}

export const useGameplayStore = create<GameplayState>()(
    subscribeWithSelector((set, get) => ({
    currentPlayers: null,
    currentPlayerId: null,
    currentPlaylist: null,
    currentSongId: null,
    isAudioPlayerRunning: false,

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
        const unheardSongs = currentPlaylist.filter((song: Song) => !song.hasBeenPlayed)
        if (unheardSongs.length === 0) {
            console.log("We ran out of new songs!")
            return
        }

        console.log(unheardSongs)

        const randomSong = unheardSongs[Math.floor(Math.random() * unheardSongs.length)]
        const updatedPlaylist = currentPlaylist.map((song: Song) =>
            song.id === randomSong.id ? { ...song, hasBeenPlayed: true } : song
        )
	console.log(randomSong)
	console.log(updatedPlaylist)

        const { currentPlayers, currentPlayerId } = get()
        const player = currentPlayers?.find((p: Player) => p.id === currentPlayerId)

        console.log(`${player?.name}'s time to shine!`)
        player?.deck.forEach((song: Song) => console.log(song.year, song.title))
        console.log("Playing", randomSong.title)
        set({ isAudioPlayerRunning: true })

        set({ currentPlaylist: updatedPlaylist, currentSongId: randomSong.id })
    },

    stopPlayer: () => {
        console.log("audio player stopped!")
        set({ isAudioPlayerRunning: false })
    },

    goToNextPlayer: () => {
        const { currentPlayerId, currentPlayers } = get()
        if (!currentPlayers || currentPlayerId === null) return;
        const currentPlayerIndex = currentPlayers?.findIndex((p: Player) => p.id === currentPlayerId)
        const newPlayerId = currentPlayers[(currentPlayerIndex + 1) % currentPlayers.length].id
        set({ currentPlayerId: newPlayerId })
    },

    addCardToPlayersDeck: () => {
        const { currentPlayerId, currentPlayers, currentSongId, currentPlaylist } = get()
        const currentPlayerIndex = currentPlayers?.findIndex((p: Player) => p.id === currentPlayerId)
        if(!currentPlayers)
            return
        if(!currentPlayerIndex)
            return
	const currentPlayerDeck = currentPlayers[currentPlayerIndex].deck
	const currentSongIndex = currentPlaylist?.findIndex((s: Song) => s.id === currentSongId)

        function sortDeckByYear(deck: Song[]): Song[] {
            function compareYearsCB(songA: Song, songB: Song) {
                return songA.year - songB.year;
            }
            return [...deck].sort(compareYearsCB);
        }

	const updatedPlayers = [...currentPlayers]

        updatedPlayers[currentPlayerIndex].deck = currentPlaylist && currentSongIndex ? sortDeckByYear([...currentPlayers[currentPlayerIndex].deck, currentPlaylist[currentSongIndex]]) : updatedPlayers[currentPlayerIndex].deck
	set({currentPlayers: updatedPlayers})
    }
})))

//------------------ subscription stuff -------------------------

useGameplayStore.subscribe(listenForCurrentPlayersChange, firePlayersChangeSideEffectACB)

// Listening for changes in currentPlayers
function listenForCurrentPlayersChange(state: GameplayState) {
    return state.currentPlayers
}

//Gets the new and the old value of the state fields we are listening to
async function firePlayersChangeSideEffectACB(newPlayers: Player[] | null, prevPlayers: Player[] | null){
    if(!newPlayers)
        return
    console.log("Processing new player amount with supabase...")
    const { data, error } = await upsertPlayers(newPlayers)
    if (error) {
        console.error("Could not save players in supabase:", error)
      } else {
        console.log("Players saved in supabase:", data)
      }
}