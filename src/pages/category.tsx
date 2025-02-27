import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
  IonButtons,
  IonIcon,
} from "@ionic/react";

import { useEffect, useState, useCallback } from "react";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import { heart, search } from "ionicons/icons";
import type { Game } from "../types";

interface CategoryPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const CategoryPage: React.FC<CategoryPageProps> = ({ match }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const id = match.params.id;

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://games.gamepix.com/games?sid=${import.meta.env.VITE_SID}&category=${id}`
      );
      setGames(response.data.data);
    } catch (err) {
      setError("Failed to fetch games");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <IonPage>
      <IonHeader translucent={true} className="ion-no-border">
        <IonToolbar className="ion-space px-2 md:px-12 lg:px-18 xl:px-24 ion-padding-vertical pb-0">
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={heart} />
            </IonButton>
          </IonButtons>
          <IonTitle>Zooeey Games</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="container mx-auto px-4 pb-10">
          <IonHeader collapse="fade">
            <IonToolbar>
              <IonTitle size="large" className="ion-no-padding ion-padding-top">
                {!loading && games.length > 0
                  ? "Category: " + games[0].category
                  : "Loading..."}
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <div className=" grid grid-cols-12 gap-6 pt-10">
            {loading
              ? Array.from({ length: 32 }).map((_, index) => (
                  <div
                    key={index}
                    className="col-span-4 md:col-span-3 lg:col-span-2 2xl:col-span-1 flex justify-center"
                  >
                    <div className="rounded-lg w-full h-24 bg-gray-300 animate-pulse"></div>
                  </div>
                ))
              : games.map((game) => (
                  <a
                    href={`/game/${game.id}`}
                    key={game.id}
                    className="col-span-4 md:col-span-3 lg:col-span-2 2xl:col-span-1 flex justify-center"
                  >
                    <img
                      src={game.thumbnailUrl}
                      alt={game.title}
                      width={250}
                      height={250}
                      loading="lazy"
                      className=" rounded-3xl w-full shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
                    />
                  </a>
                ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CategoryPage;
