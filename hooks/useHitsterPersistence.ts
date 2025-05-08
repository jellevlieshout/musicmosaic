import { useEffect, useState, useRef } from 'react';
import { initializeHitsterObserver, HitsterObserver } from '@/utils/supabase/hitsterObserver';
import { loadGameState } from '@/utils/supabase/hitsterLoader';
import { useGameplayStore } from '@/stores/hitsterModelStore';

/**
 * Hook to manage the persistence of the Hitster game state
 * @param gameId The unique identifier for the game, or null to create a new game
 * @returns An object with loading state, error information, and the game ID
 */
export function useHitsterPersistence(gameId: string | null) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [observer, setObserver] = useState<HitsterObserver | null>(null);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const { setGameSettings, setPlaylist } = useGameplayStore();
  const hasCreated = useRef(false); 

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      if(!gameId && hasCreated.current){
         return
      } 
      try {
        // Load or create game state from Supabase
        const newGameId = await loadGameState(gameId);
        if (!gameId){
          hasCreated.current = true;   // flagga att vi har skapat
        }
        
        if (isMounted) {
          setCurrentGameId(newGameId);
          
          // Initialize the observer to persist future changes
          const newObserver = initializeHitsterObserver(newGameId);
          setObserver(newObserver);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setIsLoading(false);
        }
      }
    }

    initialize();

    // Cleanup function
    return () => {
      isMounted = false;
      if (observer) {
        observer.cleanup();
      }
    };
  }, [gameId]);

  return { isLoading, error, gameId: currentGameId };
} 