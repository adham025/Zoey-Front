import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonLoading,
} from "@ionic/react";
import NativeAd from "../pages/NativeAd";
import { useEffect, useState, useCallback } from "react";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import { heart, play } from "ionicons/icons";
import { LuShare2 } from "react-icons/lu";
import { GoHeart, GoHeartFill } from "react-icons/go";
import GamePlayer from "../components/GamePlayer";
import { Share } from "@capacitor/share";
import { isGameSaved, removeSavedGame, saveGame } from "../utils/saveGames";
import { Game } from "../types";

interface GamePageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const GamePage: React.FC<GamePageProps> = ({ match }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const id = match.params.id;

  const gameFallbacks: Record<string, { image: string; description: string }> = {

    someothergame: {
      image: "https://example.com/default-othergame.jpg",
      description: "Experience thrilling the action!",
    },
  };
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    } catch (error) {
      return "/default-game-thumbnail.jpg"; // Fallback
    }
  };
  
  const fetchGame = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`Fetching game with ID: ${id}`);
  
      const response = await axios.get(`http://localhost:3000/api/games?gid=${id}`);
      console.log("API Response:", response.data);
  
      if (response.data && response.data.games) {
        let foundGame = response.data.games.find((g: Game) => g.id.toString() === id);
  
        if (foundGame) {
          // Convert game title to lowercase for case-insensitive comparison
          const gameKey = foundGame.title.toLowerCase();
          
          if (gameFallbacks[gameKey]) {
            foundGame = {
              ...foundGame,
              thumbnailUrl100: foundGame.thumbnailUrl100 || gameFallbacks[gameKey].image,
              description: foundGame.description || gameFallbacks[gameKey].description,
            };
          }
  
          setGame(foundGame);
        } else {
          console.warn("Game not found, keeping previous state.");
        }
      } else {
        console.error("Invalid API response");
      }
    } catch (err) {
      console.error("Error fetching game:", err);
      setError("Failed to fetch game");
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  
  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  useEffect(() => {
    if (game && game.id) {
      setSaved(isGameSaved(game.id));
    }
  }, [game]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//pl25996113.effectiveratecpm.com/24/62/a3/2462a3db200158df6288102f27b534f2.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, [game]); 
  
  const saveToFav = useCallback(() => {
    if (game) {
      saveGame(game);
      setSaved(true);
    }
  }, [game]);

  const removeFav = useCallback(() => {
    if (game) {
      removeSavedGame(game.id);
      setSaved(false);
    }
  }, [game]);

  if (loading) {
    return <IonLoading isOpen={loading} message="Loading..." />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!game) {
    return <div className="text-center">No game found</div>;
  }


  return (
    <IonPage>
      <IonHeader translucent={true} className="ion-no-border">
        <IonToolbar className="ion-space px-6 md:px-12 lg:px-18 xl:px-24 ion-padding-vertical pb-0">
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={heart} />
            </IonButton>
          </IonButtons>
          <IonTitle>Zooeey Games</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="container mx-auto grid grid-cols-12 gap-6">
          <div className="hidden md:block col-span-2">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-5321820362785108"
              data-ad-slot={9401317722}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>

          <div className="col-span-full md:col-span-10 lg:col-span-8">
            <IonCard>
              <div className="px-5 pt-4">
              
<img
  src={game.thumbnailUrl100 || game.thumbnailUrl || getFavicon(game.url)}
  alt={game.title}
  width={100}
  height={100}
  className="rounded-lg"
/>

                <div className="absolute top-6 right-6 flex items-center gap-6">
                  <LuShare2
                    className="text-3xl text-primary cursor-pointer"
                    onClick={() =>
                      Share.share({
                        title: game.title,
                        text: game.description,
                        url: `https://zooeey.com/game/${game.id}`,
                        dialogTitle: "Share with friends",
                      })
                    }
                  />
                  <div>
                    {saved ? (
                      <GoHeartFill
                        onClick={removeFav}
                        className="text-3xl text-red-500 cursor-pointer"
                      />
                    ) : (
                      <GoHeart
                        onClick={saveToFav}
                        className="text-3xl text-red-500 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>
              <IonCardHeader>
                <IonCardTitle>{game.title}</IonCardTitle>
                {game.categories && (
                  <IonCardSubtitle>
                    {game.categories.join(", ")}
                  </IonCardSubtitle>
                )}
              </IonCardHeader>

              <IonCardContent>
                <p className="pb-6">{game.description}</p>
                {!showPlayer && (
                  <IonButton
                    expand="full"
                    shape="round"
                    onClick={() => setShowPlayer(true)}
                  >
                    Play Now
                    <IonIcon slot="end" icon={play} />
                  </IonButton>
                )}
              </IonCardContent>
            </IonCard>

            {showPlayer && <GamePlayer url={game.url} />}
{/* <NativeAd /> */}

          </div>

          <div className="hidden lg:block col-span-2">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-5321820362785108"
              data-ad-slot={9401317722}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>

        {Array.isArray(game.category) && game.category.length > 0 && (
  <RelevantGames category={game.category} />
)}
      </IonContent>
    </IonPage>
  );
};

const RelevantGames = ({ category }: { category?: string[] }) => { 
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category || category.length === 0) return; 
    fetchGames();
  }, [category]);

  const fetchGames = useCallback(async () => {
    if (!category || !Array.isArray(category) || category.length === 0) {
      console.warn("No valid category provided for fetching relevant games.");
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/games?category=${category.join(",")}`
      );
      setGames(response.data.data);
    } catch (err) {
      setError("Failed to fetch games");
    } finally {
      setLoading(false);
    }
  }, [category]);
  

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


export default GamePage;
