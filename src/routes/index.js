import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux'
import App from 'components/pages';
import Layout from "components/base/layout";
import {Switch} from "react-router";
import NotFound from "./not_found";

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Layout>
        <Switch>
          <Route path="/" component={App}/>
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  </Provider>
);

export default Root;
