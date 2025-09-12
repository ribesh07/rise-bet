interface GameProps {
  game: { id: number; name: string; players: number; img: string };
}

export default function GameCard({ game }: GameProps) {
  return (
    <div className="bg-[#1a1c2a] rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
      <img src={game.img} alt={game.name} className="w-full h-28 object-cover" />
      <div className="p-2">
        <p className="text-white font-semibold text-sm">{game.name}</p>
        <p className="text-xs text-gray-400">{game.players} playing</p>
      </div>
    </div>
  );
}
