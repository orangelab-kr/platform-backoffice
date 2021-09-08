import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Dashboard, RequiredLogin } from './components';
import './index.css';
import {
  AccessKeys,
  AccessKeysDetails,
  DiscountGroupDetails,
  Login,
  Logs,
  Main,
  NotFound,
  PermissionGroups,
  PermissionGroupsDetails,
  Rides,
  RidesDetails,
  Settings,
  Users,
  UsersDetails,
  Webhooks,
  WebhooksDetails,
} from './pages';
import { RenderAfterNavermapsLoaded } from 'react-naver-maps';

export const baseURL = 'https://openapi.staging.hikick.kr/v1';
// export const baseURL = 'http://localhost:3000/v1';

ReactDOM.render(
  <div className="App">
    <RenderAfterNavermapsLoaded ncpClientId="nd1nqudj4x">
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
                  <Route path="/dashboard/users" exact>
                    <Users />
                  </Route>
                  <Route path="/dashboard/users/:userId">
                    <UsersDetails />
                  </Route>
                  <Route path="/dashboard/rides" exact>
                    <Rides />
                  </Route>
                  <Route path="/dashboard/rides/:rideId">
                    <RidesDetails />
                  </Route>
                  <Route path="/dashboard/accessKeys" exact>
                    <AccessKeys />
                  </Route>
                  <Route path="/dashboard/accessKeys/:platformAccessKeyId">
                    <AccessKeysDetails />
                  </Route>
                  <Route path="/dashboard/permissionGroups" exact>
                    <PermissionGroups />
                  </Route>
                  <Route path="/dashboard/permissionGroups/:permissionGroupId">
                    <PermissionGroupsDetails />
                  </Route>
                  <Route path="/dashboard/webhooks" exact>
                    <Webhooks />
                  </Route>
                  <Route path="/dashboard/webhooks/:requestId">
                    <WebhooksDetails />
                  </Route>
                  <Route path="/dashboard/discountGroups/:discountGroupId">
                    <DiscountGroupDetails />
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
    </RenderAfterNavermapsLoaded>
  </div>,
  document.getElementById('root')
);
