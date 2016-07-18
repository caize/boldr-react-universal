import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import match from 'react-router/lib/match';
import routes from './config/routes';

// Get the DOM Element that will host our React application.
const container = document.getElementById('app');

function renderApp() {
  match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
    if (error) {
      // TODO: Error handling.
      console.log('==> 😭  React Router match failed.'); // eslint-disable-line no-console
    }

    render(
      <AppContainer>
        <Router {...renderProps} />
      </AppContainer>,
      container
    );
  });
}

// The following is needed so that we can hot reload our App.
if (process.env.NODE_ENV === 'development' && module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept();
  // Any changes to our routes will cause a hotload re-render.
  module.hot.accept('./config/routes', renderApp);
}

renderApp();
