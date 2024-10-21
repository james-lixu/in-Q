import { useState, useEffect } from "react";
import MainLayout from "../pages/MainLayout";
import Spinner from "../components/Spinner";

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopGames = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/games/top-games"
        );
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top games:", error);
        setLoading(false);
      }
    };

    fetchTopGames();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex w-full h-screen justify-center items-center"><Spinner/></div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold mb-4">Games</h1>
        <div className="game-list grid grid-cols-3 md:grid-cols-4 gap-6">
          {games.map((game) => (
            <div key={game.id} className="game-item rounded-lg">
              <h2 className="text-md font-semibold mb-2 whitespace-nowrap truncate">{game.name}</h2>
              {game.box_art_url && (
                <img
                  src={game.box_art_url
                    .replace("{width}", "300")
                    .replace("{height}", "400")}
                  alt={game.name}
                  className="w-full h-auto object-cover rounded-md"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Games;
