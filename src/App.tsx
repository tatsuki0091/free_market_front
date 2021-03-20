import React from "react";
import "./App.css";
import Core from "./features/core/Core";
import Detail from "./features/core/Detail";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Core} />
          <Route path="/detail/:id" component={Detail} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
