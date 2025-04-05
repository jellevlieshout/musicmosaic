import { createClient } from "@/utils/supabase/client";
import { Player, Song, useGameplayStore } from "@/stores/hitsterModelStore";

/**
 * Load a game state from Supabase and update the Zustand store
 * @param gameId The unique identifier for the game
 * @returns A promise that resolves when the state is loaded
 */
export async function loadGameState(gameId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // Fetch the gameplay state from Supabase
    const { data, error } = await supabase
      .from('gameplay_states')
      .select('*')
      .eq('id', gameId)
      .single();
    
    if (error) {
      console.error('Error loading gameplay state:', error);
      return false;
    }
    
    if (!data) {
      console.log('No gameplay state found for game ID:', gameId);
      return false;
    }
    
    // Update the Zustand store with the loaded state
    const { setPlaylist, seatPlayersInRandomOrder } = useGameplayStore.getState();
    
    // Set the playlist if it exists
    if (data.current_playlist) {
      setPlaylist(data.current_playlist);
    }
    
    // Set the players if they exist
    if (data.current_players) {
      seatPlayersInRandomOrder(data.current_players);
    }
    
    // Set the current song ID if it exists
    if (data.current_song_id) {
      useGameplayStore.setState({ currentSongId: data.current_song_id });
    }
    
    console.log('Game state loaded successfully');
    return true;
  } catch (error) {
    console.error('Error in loadGameState:', error);
    return false;
  }
} 