import _debug from 'debug';
import Express from 'express';

import React from 'react';
import ReactDOM from 'react-dom/server';
import match from 'react-router/lib/match';
import createHistory from 'react-router/lib/createMemoryHistory';
import RouterContext from 'react-router/lib/RouterContext';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { trigger } from 'redial';
import ApiClient from '../core/api/ApiClient';
import configureStore from '../core/redux/configureStore';

import Html from '../components/tpl.Html';

import getRoutes from '../scenes/index';

const debug = _debug('boldr:server');
// Create our express server.
const app = new Express();

// Get an instance of the express Router
const router = Express.Router(); // eslint-disable-line

app.use((req, res) => {
  if (__DEV__) {
    webpackIsomorphicTools.refresh();
  }

  const client = new ApiClient(req);
  const memoryHistory = createHistory(req.originalUrl);
  const location = memoryHistory.createLocation(req.originalUrl);
  const store = configureStore(memoryHistory, client);
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' + // eslint-disable-line
      ReactDOM.renderToString(<Html assets={ webpackIsomorphicTools.assets() } store={ store } />));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({
    history,
    routes: getRoutes(store),
    location
  }, (error, redirectLocation, renderProps, ...args) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      const { dispatch } = store;

      const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,
        dispatch
      };

      const { components } = renderProps;

      trigger('fetch', components, locals).then(() => {
        global.navigator = { userAgent: req.headers['user-agent'] };


        const component = (
          <Provider store={ store } key="provider">
          <RouterContext { ...renderProps } />
          </Provider>
        );
        res.status(200);

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(
            <Html assets={ webpackIsomorphicTools.assets() } component={ component } store={ store } />
          ));
      }).catch((mountError) => {
        debug(mountError.stack);
        return res.status(500);
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

export default app;
