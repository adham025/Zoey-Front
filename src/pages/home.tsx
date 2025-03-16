import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
} from "@ionic/react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { heart } from "ionicons/icons";
import type { Game } from "../types";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <IonPage>
      <IonHeader translucent className="ion-no-border">
        <IonToolbar className="ion-space px-2 md:px-12 lg:px-18 xl:px-24 ion-padding-vertical pb-0">
          <IonButtons slot="end">
            <IonButton href="/saved">
              <IonIcon icon={heart} />
            </IonButton>
          </IonButtons>
          <IonTitle>Zooeey Games</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="container mx-auto px-4 pb-10">
          {/* Search Bar */}
          <IonSearchbar
            debounce={300}
            placeholder="Search games..."
            onIonInput={(e) => setSearchTerm(e.detail.value!)}
          />

          <IonHeader collapse="fade">
            <IonToolbar>
              <IonTitle size="large" className="ion-no-padding ion-padding-top">
                Most Played
              </IonTitle>
            </IonToolbar>
          </IonHeader>

          {/* Game List Component */}
          <GameList searchTerm={searchTerm} />
        </div>
      </IonContent>
    </IonPage>
  );
};

const GameList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [categoriesWithGames, setCategoriesWithGames] = useState<Record<string, Game[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const API_URL = "http://localhost:3000";
  const API_URL = "https://zoey-back-production.up.railway.app";

  const fetchAllGames = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/games`);
      const categorizedGames = response.data?.games || {};
      setCategoriesWithGames(categorizedGames);
    } catch (err) {
      setError("Failed to fetch games");
    } finally {
      setLoading(false);
    }
  }, []);
  

  useEffect(() => {
    fetchAllGames();
  }, [fetchAllGames]);

  // Filter games based on search term
  const filteredCategories = Object.keys(categoriesWithGames || {}).reduce(
    (acc, category) => {
      const filteredGames = categoriesWithGames[category].filter(
        (game) =>
          game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (game.description &&
            game.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      if (filteredGames.length > 0) {
        acc[category] = filteredGames;
      }
      return acc;
    },
    {} as Record<string, Game[]>
  );

  if (loading) return <div className="text-center py-10">Loading games...</div>;
  if (error) return <div className="text-center py-10">{error}</div>;

  return (
    <div className="container mx-auto">
      {Object.entries(filteredCategories).map(([category, categoryGames]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-bold mb-3">{category}</h2>
          <div className="flex gap-6 overflow-x-scroll whitespace-nowrap scrollbar-hide">
            {categoryGames.map((game, index) => (
              <div
                key={game.id}
                className="col-span-4 md:col-span-3 lg:col-span-2 2xl:col-span-1 flex flex-col items-center justify-center"
              >
                <Link
                  to={{
                    pathname: `/game/${game.id}`,
                    state: { game },
                  }}
                  className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-3xl overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={game.thumbnailUrl || "/default-game-thumbnail.jpg"}
                    alt={game.title}
                    width={250}
                    height={250}
                    loading="lazy"
                    className="rounded-3xl w-full h-full object-cover shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
                  />
                </Link>
                <h3 className="text-sm md:text-base font-medium mt-2 text-center">
                  {index + 1}. {game.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
