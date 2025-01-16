import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from "react-router";
import Profile from "../pages/Profile";
import Videos from "../pages/IntroVideos";
import PetInfo from "../pages/PetInfo";

const PrivateRoutes = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Switch>
          <Route path="/videos" render={() => <Videos />} exact={true} />
          <Route path="/profile" render={() => <Profile />} exact={true} />
          <Route
            path="/pet/info"
            render={() => <PetInfo type="non-editable" />}
            exact={true}
          />
          <Redirect from="/" to="/videos" />
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default PrivateRoutes;
