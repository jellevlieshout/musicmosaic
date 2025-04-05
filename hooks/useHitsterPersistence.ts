import { useEffect, useState } from 'react';
import { initializeHitsterObserver, HitsterObserver } from '@/utils/supabase/hitsterObserver';
import { loadGameState } from '@/utils/supabase/hitsterLoader';

/**
 * Hook to manage the persistence of the Hitster game state
 * @param gameId The unique identifier for the game
 * @returns An object with loading state and error information
 */
export function useHitsterPersistence(gameId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [observer, setObserver] = useState<HitsterObserver | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        // Load the game state from Supabase
        const success = await loadGameState(gameId);
        
        if (!success && isMounted) {
          setError('Failed to load game state');
        }
        
        // Initialize the observer to persist future changes
        const newObserver = initializeHitsterObserver(gameId);
        
        if (isMounted) {
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

  return { isLoading, error };
} 