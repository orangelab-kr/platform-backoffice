import "./App.css";

import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Dashboard, NotFound } from "./pages";

import { Login } from "./pages/Login";

export const baseURL = "https://openapi.staging.hikick.kr/v1/platform";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Dashboard} />
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
    </div>
  );
}

export default App;
