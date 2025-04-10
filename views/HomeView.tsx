"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NeonTitle from "@/components/NeonTitle";

export default function HomeView() {
 
    return (
      <>
        <div className="items-center flex flex-col gap-5 py-8">
          <div className="mb-4">
            <NeonTitle />
          </div>
          <h1 className="neon-tubes-styling text-3xl mt-4">Welcome</h1>
          <div className="flex flex-col gap-3 mt-4">
            <Button asChild size="lg" variant={"secondary"}>
              <Link href="/protected/new-game">New game</Link>
            </Button>
            <Button asChild size="lg" variant={"secondary"}>
              <Link href="/protected/leaderboard">View rankings</Link>
            </Button>
          </div>
        </div>
      </>
    );
}