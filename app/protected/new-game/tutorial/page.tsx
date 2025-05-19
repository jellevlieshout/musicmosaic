"use client";

import { useHitsterPersistence } from "@/hooks/useHitsterPersistence";
import GameTutorialView from "@/views/GameTutorialView";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TutorialContent() {
  const searchParams = useSearchParams();
  const gameIdParam = searchParams.get('gameId');
  const { gameId } = useHitsterPersistence(gameIdParam);
  
  return <GameTutorialView gameId={gameId}/>;
}

export default function GameTutorialPresenter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TutorialContent />
    </Suspense>
  );
}
