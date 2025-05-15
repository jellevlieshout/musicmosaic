import { useEffect, useState, useRef } from 'react';
import { loadGameState } from '@/utils/supabase/hitsterLoader';
import { useGameplayStore } from '@/stores/hitsterModelStore';
import { useHitster } from '@/contexts/HitsterContext';

/**
 * Hook to manage the persistence of the Hitster game state
 * @param gameId The unique identifier for the game, or null to create a new game
 * @returns An object with loading state, error information, and the game ID
 */
export function useHitsterPersistence(gameId: string | null) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const { setGameId } = useHitster();
  const hasCreated = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      if(!gameId && hasCreated.current) {
        return;
      }
      try {
        // Load or create game state from Supabase
        const newGameId = await loadGameState(gameId);
        if (!gameId) {
          hasCreated.current = true;
        }
        
        if (isMounted) {
          setCurrentGameId(newGameId);
          setGameId(newGameId);
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

    return () => {
      isMounted = false;
    };
  }, [gameId, setGameId]);

  return { isLoading, error, gameId: currentGameId };
} 