import "./index.css";

import {
  AccessKeys,
  Logs,
  Main,
  NotFound,
  PermissionGroups,
  Settings,
  Users,
  UsersDetails,
} from "./pages";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Dashboard, RequiredLogin } from "./components";

import { Login } from "./pages/Login";
import React from "react";
import ReactDOM from "react-dom";

export const baseURL = "https://openapi.staging.hikick.kr/v1/platform";

ReactDOM.render(
  <div className="App">
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/dashboard" />
        </Route>
        <Route path="/dashboard">
          <RequiredLogin>
            <Dashboard>
              <Switch>
                <Route path="/dashboard" exact>
                  <Redirect to="/dashboard/main" />
                </Route>
                <Route path="/dashboard/main">
                  <Main />
                </Route>
                <Route exact path="/dashboard/users">
                  <Users />
                </Route>
                <Route path="/dashboard/users/:userId">
                  <UsersDetails />
                </Route>
                <Route path="/dashboard/accessKeys">
                  <AccessKeys />
                </Route>
                <Route path="/dashboard/permissionGroups">
                  <PermissionGroups />
                </Route>
                <Route path="/dashboard/logs">
                  <Logs />
                </Route>
                <Route path="/dashboard/settings">
                  <Settings />
                </Route>
              </Switch>
            </Dashboard>
          </RequiredLogin>
        </Route>
        <Route path="/auth">
          <Switch>
            <Route path="/auth" exact>
              <Redirect to="/auth/login" />
            </Route>
            <Route path="/auth/login" component={Login} />
          </Switch>
        </Route>
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  </div>,
  document.getElementById("root")
);
