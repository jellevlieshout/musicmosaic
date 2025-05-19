import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SpotifyState {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  displayName: string | null;
  setDisplayName: (name: string | null) => void;
  clearAccessToken: () => void
}

export const useSpotifyStore = create<SpotifyState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      displayName: null,
      setDisplayName: (name) => set({ displayName: name }),
      clearAccessToken: () => set({ accessToken: null, displayName: null }),
    }),
    {
      name: 'spotify-storage',
    }
  )
) 