import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import HomePage from "./pages/home";
import GamePage from "./pages/game";
import CategoriesPage from "./pages/categories";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/main.css";

import { LuHeart, LuHome, LuList, LuUser } from "react-icons/lu";
import { BiCategory } from "react-icons/bi";
import CategoryPage from "./pages/category";
import SavedGamesPage from "./pages/savedGames";
import AdminPanel from "./pages/AdminPage";
import ProtectedRoute from "./pages/ProtectedRoute";

setupIonicReact({
  mode: "ios",
});

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <HomePage />
          </Route>
          <Route exact path="/categories">
            <CategoriesPage />
          </Route>
          <Route
            exact
            path="/category/:id"
            render={(props) => <CategoryPage {...props} />}
          />
          <Route exact path="/game/:id" component={GamePage} />
          <Route exact path="/saved">
            <SavedGamesPage />
          </Route>
          <ProtectedRoute path="/admin" component={AdminPanel} />
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom" translucent={true} className="py-2">
  {localStorage.getItem("Admin2025Token") && (
    <IonTabButton tab="admin" href="/admin">
      <LuUser className="text-2xl" />
      <IonLabel>Admin</IonLabel>
    </IonTabButton>
  )}
  <IonTabButton tab="home" href="/home">
    <LuHome className="text-2xl" />
    <IonLabel>Home</IonLabel>
  </IonTabButton>
  <IonTabButton tab="categories" href="/categories">
    <BiCategory className="text-2xl" />
    <IonLabel>Categories</IonLabel>
  </IonTabButton>
  <IonTabButton tab="saved" href="/saved">
    <LuHeart className="text-2xl" />
    <IonLabel>Saved</IonLabel>
  </IonTabButton>
</IonTabBar>

      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
