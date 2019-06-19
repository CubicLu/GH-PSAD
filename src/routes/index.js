import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux'
import App from 'components/pages';
import {Switch} from "react-router";
import NotFound from "./not_found";

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" component={App}/>
        <Route component={NotFound} />
      </Switch>
    </Router>
  </Provider>
);

export default Root;
