// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from './utils/asyncInjectors';
import { Route, IndexRoute } from 'react-router'
import App from 'containers/App'
import HomePage from 'containers/HomePage'
import FeaturePage from 'containers/FeaturePage'
import NotFoundPage from 'containers/NotFoundPage'
import React from 'react'
const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/features" component={FeaturePage} />
    <Route path="*" component={NotFoundPage} />
  </Route>
)
