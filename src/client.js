import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Router, browserHistory, match } from 'react-router/es6';
import routes from './config/routes';

const container = document.getElementById('app');

function renderApp() {
  match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
    if (error) {
      console.log('==> 😭  React Router match failed.'); // eslint-disable-line no-console
    }

    render(
      <AppContainer>
        <Router { ...renderProps } />
      </AppContainer>,
      container
    );
  });
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
  module.hot.accept('./config/routes', renderApp);
}

renderApp();
