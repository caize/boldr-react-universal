import React from 'react';
import ReactDOM from 'react-dom';
import { RouterContext, createMemoryHistory, match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';

import configureStore from '../../../core/redux/configureStore';
import getRoutes from '../../../scenes/index'; // eslint-disable-line
import Html from '../../../components/tpl.Html';

export default (req, res) => {
  if (__DEV__) {
    webpackIsomorphicTools.refresh();
  }
  const memoryHistory = createMemoryHistory(req.originalUrl);
  const store = configureStore(memoryHistory); // , client
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={ webpackIsomorphicTools.assets() }  store={ store } />));
  }
  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }
  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', error);
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({ ...renderProps, store }).then(() => {
        const component = (
          <Provider store={ store } key="provider">
            <RouterContext { ...renderProps } />
          </Provider>
        );
        res.status(200);

        global.navigator = { userAgent: req.headers['user-agent'] };

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={ webpackIsomorphicTools.assets() }  component={ component } store={ store } />));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
};
