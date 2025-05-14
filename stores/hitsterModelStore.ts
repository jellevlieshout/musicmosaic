import { GameSettings, Player, Song } from '@/utils/types'
import { create } from 'zustand' // used to create stores (store = place where u store state & state modifying functions)
import { useSpotifyStore } from './spotifyStore'

export type GameplayState = {
    currentPlayers: Player[] | null
    currentPlayerId: string | null
    currentPlaylist: Song[] | null
    currentSongId: string | null
    isAudioPlayerRunning: boolean
    gameSettings: GameSettings | null
    isPaused: boolean

    setPlaylist: (playlist: Song[]) => void
    setCurrentSongId: (songId: string | null) => void,
    seatPlayersInRandomOrder: (players: Player[]) => void
    initializaPlayerDecks: () => void
    updatePlayersWithIds: (players: Player[]) => void
    pickRandomNewSong: () => void,
    playRandomNewSongFromCurrentPlaylist: () => void
    startPlayer: () => void
    stopPlayer: () => void
    goToNextPlayer: () => void
    addCardToPlayersDeck: () => void
    setGameSettings: (settings: { location: string, allowSteals: boolean, songNameBonus: boolean, gameLength: string }) => void
    resetModel: () => void
    pauseGame: () => void
    resumeGame: () => void
    restartGame: () => void
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
    isPaused: false,

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
            // add hasBeenPlayed field if it doesn't exist in the playlist yet
            if (!('hasBeenPlayed' in song)) {
                return { ...song, hasBeenPlayed: false }
            }
            return song
        }
        const updatedPlaylist = playlist.map(addHasBeenPlayedField)
        set({ currentPlaylist: updatedPlaylist })
    },

    setCurrentSongId: (songId: string | null) => {
        set({ currentSongId: songId })
    },

    seatPlayersInRandomOrder: (players: Player[]) => {
        const shuffled = players
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        set({ currentPlayers: shuffled, currentPlayerId: shuffled[0]?.id ?? null })
    },

    initializaPlayerDecks: () => {
        const { currentPlayers } = get()
        currentPlayers.forEach(() => {
            get().pickRandomNewSong()
            get().addCardToPlayersDeck()
            get().goToNextPlayer()
        })
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

    pickRandomNewSong: () => {
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

      set({ 
        currentPlaylist: updatedPlaylist, 
        currentSongId: randomSong.id,
      })

    },

    playRandomNewSongFromCurrentPlaylist: () => {
        get().pickRandomNewSong()
        const { currentSongId, currentPlaylist } = get()
        const currentSong = currentPlaylist?.find((s: Song) => s.id === currentSongId)

        const { currentPlayers, currentPlayerId } = get()
        const player = currentPlayers?.find((p: Player) => p.id === currentPlayerId)

        console.log(`${player?.name}'s time to shine!`)
        player?.deck.forEach((song: Song) => console.log(song.year, song.title))
        console.log("Playing", currentSong.title)

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
                initializePlayer(accessToken, currentSong.id);
            };
        } else {
            initializePlayer(accessToken, currentSong.id);
        }

        set({ 
            isAudioPlayerRunning: true
        })
    },

    startPlayer: () => {
      console.log("audio player starting!")
      const accessToken = useSpotifyStore.getState().accessToken;
      if (!accessToken) {
          console.error("No Spotify access token found");
          return;
      }
      const { currentSongId, currentPlaylist } = get()
      const currentSong = currentPlaylist?.find((s: Song) => s.id === currentSongId)

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
              initializePlayer(accessToken, currentSong.id);
          };
      } else {
          initializePlayer(accessToken, currentSong.id);
      }

      set({ isAudioPlayerRunning: true })
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
        set({ 
            currentPlayerId: newPlayerId,
            currentSongId: null,
         })
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
      set({ currentPlayers: updatedPlayers, currentSongId: null })
    },

    /** Pause == stop the audio player *and* set the paused flag so that the UI
    * can decide to show a resume/restart/quit dialog. */
    pauseGame: () => {
            const { stopPlayer } = get();
            stopPlayer();
            set({ isPaused: true });
        },

    /** Clears the paused flag so that the UI continues as normal. */
    resumeGame: () => {
            set({ isPaused: false });
        },
    
    /**
     * Restart keeps the current game‑settings & players but resets *progress*.
     * We set every deck back to the initial state (one hidden start‑card) and
     * mark all songs in the playlist as un‑played.
     */
    restartGame: () => {
            const { currentPlayers, currentPlaylist } = get();
    
           if (!currentPlayers || !currentPlaylist) return;
    
            // reset playlist
            const resetPlaylist = currentPlaylist.map((s:any) => ({ ...s, hasBeenPlayed: false }));
    
            // each player starts with an empty deck (index 0 == timeline start card)
            const resetPlayers = currentPlayers.map((p:any) => ({ ...p, deck: [resetPlaylist[0]] }));
    
            set({
                currentPlaylist: resetPlaylist,
                currentPlayers: resetPlayers,
                currentSongId: null,
                isPaused: false,
            });
        },

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
