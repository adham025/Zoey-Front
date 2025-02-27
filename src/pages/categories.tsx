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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { heart, search } from "ionicons/icons";
import { Category } from "../types";

const categories = [
  {
    id: "a46f6ba4-0fe9-419e-945c-12d4ab0cf582",
    name: "Puzzles",
    description:
      "Train your braing playing the best free puzzle games online. Are you ready to test your puzzle mind? Play now on GamePix.",
    img: "/assets/categories/puzzle.png",
  },
  {
    id: "5690a2a7-24a5-4ad5-80d0-289a7e53fd37",
    name: "Strategy",
    description:
      "Do you like strategy games? Here you can play the best strategy games online. Start now and use the brain!",
    img: "/assets/categories/strategy.png",
  },
  {
    id: "ec8255ee-1a5d-4c26-b90a-354d2b75850e",
    name: "Junior",
    img: "/assets/categories/playtime.png",
  },
  {
    id: "1f9c4256-9f5c-4463-b072-c4d2f266719e",
    name: "Sports",
    description:
      "Are you a real sportsman? Test yourself on GamePix! You can play thousand free online sports games and become a champion!",
    img: "/assets/categories/sports.png",
  },
  {
    id: "e6e804fa-d074-4418-9b1c-a8db99364e3a",
    name: "Arcade",
    description:
      "If you want to play the best mobile games you are in the right place. WIth our html5 games you can play everywhere. Play now on GamePix.",
    img: "/assets/categories/arcade.png",
  },
  {
    id: "dd670a2c-60aa-4979-ba77-53bbb147d0c6",
    name: "Board",
    description:
      "If you like shooting, you have to play best shooting games online on GamePix. Start now and play for free.",
    img: "/assets/categories/board-game.png",
  },
  {
    id: "2342de2d-3d78-47eb-a864-bf20acb79091",
    name: "Classics",
    description:
      "Do you want to be the best fighter on the web? Start training yourself on GamePix, There are a lot of free fighting games! Go play!",
    img: "/assets/categories/snake.png",
  },
  {
    id: "13faf451-da07-432b-b7da-73bdbbe03a8b",
    name: "Adventure",
    description:
      "Start a new adventure with your avatar, try the best adventure games! Start your adventure now on GamePix.",
    img: "/assets/categories/treasure-map.png",
  },
];

const CategoriesPage: React.FC = () => {
  // const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // const fetchGames = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get("https://games.gamepix.com/categories");
  //     setCategories(response.data.data);
  //     console.log(response.data);
  //   } catch (err) {
  //     setError("Failed to fetch games");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchGames();
  // }, []);
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
                Categories
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <div className=" grid grid-cols-12 ">
            {loading
              ? Array.from({ length: 32 }).map((_, index) => (
                  <div
                    key={index}
                    className="col-span-full md:col-span-6 mb-6 me-6"
                  >
                    <div className="rounded-lg w-full h-24 bg-gray-300 dark:bg-dark opacity-60 animate-pulse"></div>
                  </div>
                ))
              : categories.map((category) => (
                  <a
                    href={`/category/${category.name.toLowerCase()}`}
                    key={category.id}
                    className="col-span-full md:col-span-6"
                  >
                    <IonCard>
                      <img
                        src={category.img}
                        alt={category.name}
                        height={80}
                        width={80}
                        className="mx-6 mt-6"
                      />
                      <IonCardHeader>
                        <IonCardTitle>{category.name}</IonCardTitle>
                        {/* <IonCardSubtitle>Card Subtitle</IonCardSubtitle> */}
                      </IonCardHeader>

                      <IonCardContent>{category.description}</IonCardContent>
                    </IonCard>
                  </a>
                ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CategoriesPage;
