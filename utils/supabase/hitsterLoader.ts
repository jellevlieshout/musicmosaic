import { createClient } from "@/utils/supabase/client";
import { Player, Song, useGameplayStore } from "@/stores/hitsterModelStore";

/**
 * Load a game state from Supabase and update the Zustand store
 * @param gameId The unique identifier for the game, or null to create a new game
 * @returns A promise that resolves with the game ID when the state is loaded
 */
export async function loadGameState(gameId: string | null): Promise<string> {
  try {
    const supabase = createClient();
    let data;
    
    if (gameId) {
      // Fetch existing game state
      const { data: existingData, error } = await supabase
        .from('gameplay_states')
        .select('*')
        .eq('id', gameId)
        .single();
      
      if (error) throw error;
      if (!existingData) throw new Error('Game not found');
      
      data = existingData;
    } else {
      // Create a new game
      const { data: newData, error } = await supabase
        .from('gameplay_states')
        .insert({
          game_settings: null,
          current_playlist: null,
          current_players: null,
          current_player_id: null,
          current_song_id: null
        })
        .select()
        .single();

      
      if (error) throw error;
      if (!newData) throw new Error('Failed to create new game');
      
      // Reset the model before creating a new game to ensure a clean state
      const { resetModel } = useGameplayStore.getState();
      resetModel();

      data = newData;
    }
    
    // Update the Zustand store with the loaded state
    const { setPlaylist, seatPlayersInRandomOrder, setGameSettings } = useGameplayStore.getState();
    
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

    // Set the game settings if they exist
    if (data.game_settings) {
      setGameSettings(data.game_settings);
    }
    
    console.log('Game state loaded successfully');
    return data.id;
  } catch (error) {
    console.error('Error in loadGameState:', error);
    throw error;
  }
} 