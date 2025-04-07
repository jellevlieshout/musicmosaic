import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
 
    return (
      <>
        <div className="items-center flex flex-col gap-5">
          <h1 className="neon-tubes-styling text-8xl">Music Mosaic</h1>
          <h1 className="neon-tubes-styling text-3xl">Welcome</h1>
          <Button asChild size="sm" variant={"secondary"}>
            <Link href="/protected/new-game">New game</Link>
          </Button>
          <Button asChild size="sm" variant={"secondary"}>
            <Link href="/protected/leaderboard">View rankings</Link>
          </Button>
        </div>
      </>
    );
}