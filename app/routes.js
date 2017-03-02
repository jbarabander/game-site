import { Route, IndexRoute } from 'react-router';
import App from 'containers/App';
import Home from 'containers/HomePage';
import React from 'react';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
  </Route>
);


export default routes;
