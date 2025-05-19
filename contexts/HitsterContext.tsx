'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { HitsterObserver, initializeHitsterObserver } from '@/utils/supabase/hitsterObserver';

interface HitsterContextType {
  observer: HitsterObserver | null;
  setGameId: (gameId: string) => void;
}

const HitsterContext = createContext<HitsterContextType | null>(null);

export function HitsterProvider({ children }: { children: React.ReactNode }) {
  const [observer, setObserver] = useState<HitsterObserver | null>(null);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const setGameId = useCallback((gameId: string) => {
    // Prevent unnecessary reinitialization if the game ID hasn't changed
    if (gameId === currentGameId) {
      return;
    }

    // Clean up existing observer if it exists
    if (observer) {
      observer.cleanup();
    }

    // Initialize new observer
    console.log('Initializing new observer for game:', gameId);
    const newObserver = initializeHitsterObserver(gameId);
    setObserver(newObserver);
    setCurrentGameId(gameId);
  }, [observer, currentGameId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observer) {
        observer.cleanup();
      }
    };
  }, [observer]);

  return (
    <HitsterContext.Provider value={{ observer, setGameId }}>
      {children}
    </HitsterContext.Provider>
  );
}

export function useHitster() {
  const context = useContext(HitsterContext);
  if (!context) {
    throw new Error('useHitster must be used within a HitsterProvider');
  }
  return context;
} 