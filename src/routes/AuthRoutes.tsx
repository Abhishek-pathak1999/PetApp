import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Switch, Route, Redirect } from "react-router";
import Login from "../pages/Login";

const PublicRoutes = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Switch>
          <Route path="/login" render={() => <Login />} exact={true} />
          <Route path="/" render={() => <Redirect to="/login" />} />
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default PublicRoutes;
