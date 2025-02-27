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
import { heart, search } from "ionicons/icons";
import type { Game } from "../types";
import { getSavedGame } from "../utils/saveGames";

const SavedGamesPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    setGames(getSavedGame());
  }, []);

  return (
    <IonPage>
      <IonHeader translucent={true} className="ion-no-border">
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
          <IonHeader collapse="fade">
            <IonToolbar>
              <IonTitle size="large" className="ion-no-padding ion-padding-top">
                Saved Games
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <div className=" grid grid-cols-12 gap-6 pt-10">
            {games.length > 0 ? (
              games.map((game) => (
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
                    className=" rounded-3xl w-full shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
                  />
                </a>
              ))
            ) : (
              <div className="col-span-12 text-center">
                <img
                  src="/assets/cat.svg"
                  alt="No saved games"
                  className="mx-auto mb-4 w-80"
                />
                <p className="text-xl pt-5">No saved games yet</p>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SavedGamesPage;
