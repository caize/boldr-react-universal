import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Router, browserHistory, match } from 'react-router/es6';
import { trigger } from 'redial';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import createStore from './core/redux/createStore';
import getRoutes from './scenes/index';

const MOUNT_POINT = document.querySelector('#content');

const store = createStore(browserHistory, window.__data);
const history = syncHistoryWithStore(browserHistory, store);
const routes = getRoutes(store);

history.listen(location => {
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,
      dispatch: store.dispatch
    };

    const { components } = renderProps;

    if (window.__data) {
      delete window.__data;
    } else {
      trigger('fetch', components, locals);
    }
  });
});

function renderApp() {
  ReactDOM.render(
    <AppContainer>
    <Provider store={ store } key="provider">
      <Router routes={ routes } history={ history } />
    </Provider>
    </AppContainer>,
    MOUNT_POINT
  );
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  window.React = React; // enable debugger
  module.hot.accept();
  module.hot.accept('./scenes/index', renderApp);
}

renderApp();
