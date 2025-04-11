import { Player, Song } from "@/utils/types";

interface GameplayProps {
  currentPlayers: Player[] | null,
  currentPlayerId: string | null,
}

export default function GameplayView(props: GameplayProps) {

  console.log(props)
 
  return (
    <>
      <div className="grid grid-cols-5 gap-4 w-screen">
        <div className="col-span-1 p-4 border-r">
          {props.currentPlayers?.map((player: Player) => (
            <li key={player.id} style={{ fontWeight: player.id === props.currentPlayerId ? 'bold' : 'normal' }}>
                {player.name}
                {player.deck && player.deck.length > 0 && (
                    <ul>
                        {player.deck.map((song: Song) => (
                            <li key={song.id}>{song.year}, {song.title}</li>
                        ))}
                    </ul>
                )}
            </li>
          ))}
        </div>
        <div className="col-span-4 p-6">
          <div className="flex flex-col items-center gap-4">
            <p className="neon-tubes-styling text-8xl">{props.currentPlayers?.find((p) => props.currentPlayerId === p.id)?.name}'s turn</p>
            <p className="neon-tubes-styling text-4xl">Select a card</p>
            <div >
              <p>Timeline</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}