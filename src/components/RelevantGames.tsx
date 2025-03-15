import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { IonTitle } from "@ionic/react";
import { Game } from "../types";

interface RelevantGamesProps {
  category?: string[];
}

const RelevantGames: React.FC<RelevantGamesProps> = ({ category }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const API_URL = "http://localhost:3000";
  const API_URL = "https://zoey-back-production.up.railway.app/";

  const fetchGames = useCallback(async () => {
    if (!category || !Array.isArray(category)) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/games?category=${category.join(",")}`);
      setGames(response.data.data);
    } catch (err) {
      setError("Failed to fetch games. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return (
    <div className="container mx-auto px-4 py-10">
      <IonTitle size="large">
        {!loading && games.length > 0 ? "Relevant Games" : "Loading..."}
      </IonTitle>
      <div className="grid grid-cols-12 gap-6 pt-10">
        {loading
          ? Array.from({ length: 32 }).map((_, index) => (
              <div key={index} className="col-span-4 md:col-span-3 lg:col-span-2 flex justify-center">
                <div className="rounded-lg w-full h-24 bg-gray-300 animate-pulse"></div>
              </div>
            ))
          : games.map((game) => (
              <a
                href={`/game/${game.id}`}
                key={game.id}
                className="col-span-4 md:col-span-3 lg:col-span-2 flex justify-center"
              >
                <img
                  src={game.thumbnailUrl}
                  alt={game.title}
                  width={250}
                  height={250}
                  className="rounded-3xl w-full shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
                />
              </a>
            ))}
      </div>
    </div>
  );
};

export default React.memo(RelevantGames);