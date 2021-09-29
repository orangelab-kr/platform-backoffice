import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Dashboard, RequiredLogin } from './components';
import './index.css';
import {
  AccessKeys,
  AccessKeysDetails,
  DiscountGroupsDetails,
  DiscountGroups,
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

export const baseURL =
  window.location.host === 'platform.hikick.kr'
    ? 'https://openapi.hikick.kr/v1'
    : 'https://openapi.staging.hikick.kr/v1';

ReactDOM.render(
  <div className="App">
    <RenderAfterNavermapsLoaded ncpClientId="nd1nqudj4x">
      <BrowserRouter>
        <Switch>
          <Route path="/auth">
            <Switch>
              <Route path="/auth" exact>
                <Redirect to="/auth/login" />
              </Route>
              <Route path="/auth/login" component={Login} />
            </Switch>
          </Route>
          <Route path="/">
            <RequiredLogin>
              <Dashboard>
                <Switch>
                  <Route path="/" exact>
                    <Main />
                  </Route>
                  <Route path="/users" exact>
                    <Users />
                  </Route>
                  <Route path="/users/:userId">
                    <UsersDetails />
                  </Route>
                  <Route path="/rides" exact>
                    <Rides />
                  </Route>
                  <Route path="/rides/:rideId">
                    <RidesDetails />
                  </Route>
                  <Route path="/accessKeys" exact>
                    <AccessKeys />
                  </Route>
                  <Route path="/accessKeys/:platformAccessKeyId">
                    <AccessKeysDetails />
                  </Route>
                  <Route path="/permissionGroups" exact>
                    <PermissionGroups />
                  </Route>
                  <Route path="/permissionGroups/:permissionGroupId">
                    <PermissionGroupsDetails />
                  </Route>
                  <Route path="/webhooks" exact>
                    <Webhooks />
                  </Route>
                  <Route path="/webhooks/:requestId">
                    <WebhooksDetails />
                  </Route>
                  <Route path="/discountGroups" exact>
                    <DiscountGroups />
                  </Route>
                  <Route path="/discountGroups/:discountGroupId">
                    <DiscountGroupsDetails />
                  </Route>
                  <Route path="/logs">
                    <Logs />
                  </Route>
                  <Route path="/settings">
                    <Settings />
                  </Route>
                </Switch>
              </Dashboard>
            </RequiredLogin>
          </Route>
          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
    </RenderAfterNavermapsLoaded>
  </div>,
  document.getElementById('root')
);
