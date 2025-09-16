"use client";
import React from "react";
import ImageCard from "./ui/imagecard";
import { Card, CardContent } from "@/components/ui/card";

interface Game {
  name: string;
  image: string;
}

interface TrendingGamesProps {
  games: Game[];
  search: string;
}

const TrendingGames: React.FC<TrendingGamesProps> = ({ games, search }) => {
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="mt-4 px-4 md:px-8">
      <h3 className="text-base font-semibold mb-2">Trending Games</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row md:gap-3 overflow-x-auto gap-2 pb-2">
        {filteredGames.map((game, index) => (
          <ImageCard
            key={index}
            title={game.name}
            image={game.image}
          />
        ))}
      </div>
    </section>
  );
};

export default TrendingGames;
