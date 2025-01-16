import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from "react-router";

import Dashboard from "../pages/Dashboard";

const DashboardRoutes = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Switch>
          <Route path="/dashboard" render={() => <Dashboard />} exact={true} />
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default DashboardRoutes;
