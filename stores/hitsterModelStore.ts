// npm install zustand
import { create } from 'zustand' // used to create stores (store = place where u store state & state modifying functions)
import { useSpotifyStore } from './spotifyStore'

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
    id?: string  // Make id optional since it will be assigned by the backend
    name: string
    highestScore: number | null
    deck: Song[]
}

export type GameplayState = {
    currentPlayers: Player[] | null
    currentPlayerId: string | null
    currentPlaylist: Song[] | null
    currentSongId: string | null
    isAudioPlayerRunning: boolean
    gameSettings: {
        location: string
        allowSteals: boolean
        songNameBonus: boolean
        gameLength: string
    } | null

    setPlaylist: (playlist: Song[]) => void
    seatPlayersInRandomOrder: (players: Player[]) => void
    updatePlayersWithIds: (players: Player[]) => void
    playRandomNewSongFromCurrentPlaylist: () => void
    stopPlayer: () => void
    goToNextPlayer: () => void
    addCardToPlayersDeck: () => void
    setGameSettings: (settings: { location: string, allowSteals: boolean, songNameBonus: boolean, gameLength: string }) => void
    resetModel: () => void
    // revealSongDetails: () => void
    // playerWasRight: () => void
    // playerWasWrong: () => void
}

export const useGameplayStore = create<GameplayState>((set:any, get:any) => ({
    currentPlayers: null,
    currentPlayerId: null,
    currentPlaylist: null,
    currentSongId: null,
    isAudioPlayerRunning: false,
    gameSettings: null,

    resetModel: () => {
        set({
            currentPlayers: null,
            currentPlayerId: null,
            currentPlaylist: null,
            currentSongId: null,
            isAudioPlayerRunning: false,
            gameSettings: null
        })
    },

    setGameSettings: (settings) => {
        set({ gameSettings: settings })
    },

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

    updatePlayersWithIds: (players: Player[]) => {
        // Update players while maintaining their current order
        set((state: GameplayState) => {
            if (!state.currentPlayers) return { currentPlayers: players };
            
            // Map new IDs to existing players while preserving order
            const updatedPlayers = state.currentPlayers.map((player, index) => ({
                ...player,
                id: players[index].id
            }));
            
            return { 
                currentPlayers: updatedPlayers,
                currentPlayerId: updatedPlayers[0]?.id ?? null
            };
        });
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

        const randomSong = unheardSongs[Math.floor(Math.random() * unheardSongs.length)]
        const updatedPlaylist = currentPlaylist.map((song: Song) =>
            song.id === randomSong.id ? { ...song, hasBeenPlayed: true } : song
        )

        const { currentPlayers, currentPlayerId } = get()
        const player = currentPlayers?.find((p: Player) => p.id === currentPlayerId)

        console.log(`${player?.name}'s time to shine!`)
        player?.deck.forEach((song: Song) => console.log(song.year, song.title))
        console.log("Playing", randomSong.title)

        // Get the Spotify access token from the store
        const accessToken = useSpotifyStore.getState().accessToken;
        if (!accessToken) {
            console.error("No Spotify access token found");
            return;
        }

        // Initialize Spotify player if it doesn't exist
        if (!window.Spotify) {
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            document.body.appendChild(script);
        }

        // Wait for the SDK to be ready
        if (!window.Spotify) {
            window.onSpotifyWebPlaybackSDKReady = () => {
                initializePlayer(accessToken, randomSong.id);
            };
        } else {
            initializePlayer(accessToken, randomSong.id);
        }

        set({ 
            currentPlaylist: updatedPlaylist, 
            currentSongId: randomSong.id,
            isAudioPlayerRunning: true
        })
    },

    stopPlayer: () => {
        console.log("audio player stopped!")
        const accessToken = useSpotifyStore.getState().accessToken;
        if (!accessToken) {
            console.error("No Spotify access token found");
            return;
        }

        // Pause the Spotify player
        fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }).catch(error => {
            console.error('Error pausing Spotify player:', error);
        });

        set({ isAudioPlayerRunning: false })
    },

    goToNextPlayer: () => {
        const { currentPlayerId, currentPlayers } = get()
        const currentPlayerIndex = currentPlayers?.findIndex((p: Player) => p.id === currentPlayerId)
        const newPlayerId = currentPlayers[(currentPlayerIndex + 1) % currentPlayers.length].id
        set({ currentPlayerId: newPlayerId })
    },

    addCardToPlayersDeck: () => {
        const { currentPlayerId, currentPlayers, currentSongId, currentPlaylist } = get()
        const currentPlayerIndex = currentPlayers?.findIndex((p: Player) => p.id === currentPlayerId)
	const currentPlayerDeck = currentPlayers[currentPlayerIndex].deck
	const currentSongIndex = currentPlaylist?.findIndex((s: Song) => s.id === currentSongId)

        function sortDeckByYear(deck: Song[]): Song[] {
            function compareYearsCB(songA: Song, songB: Song) {
                return songA.year - songB.year;
            }
            return [...deck].sort(compareYearsCB);
        }

	const updatedPlayers = [...currentPlayers]

        updatedPlayers[currentPlayerIndex].deck = sortDeckByYear([...currentPlayers[currentPlayerIndex].deck, currentPlaylist[currentSongIndex]])
	set({currentPlayers: updatedPlayers})
    }
}))

// Add this helper function outside the store definition
const initializePlayer = (accessToken: string, trackId: string) => {
    const spotifyPlayer = new window.Spotify.Player({
        name: 'Music Mosaic Player',
        getOAuthToken: (cb: (token: string) => void) => cb(accessToken),
        volume: 0.5,
    });

    // Add event listeners
    spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        
        // First transfer playback to our device
        fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_ids: [device_id],
                play: false,
            }),
        }).then(() => {
            // Small delay to ensure device transfer is complete
            setTimeout(() => {
                // Play the selected track
                fetch('https://api.spotify.com/v1/me/player/play', {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uris: [`spotify:track:${trackId}`],
                    }),
                });
            }, 500);
        });
    });

    spotifyPlayer.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
    });

    spotifyPlayer.addListener('player_state_changed', (state: any) => {
        if (state) {
            console.log('Player state changed:', state);
        }
    });

    // Connect to the player
    spotifyPlayer.connect();
};
