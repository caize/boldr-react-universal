import React from 'react';
import { RouterContext, createMemoryHistory, match } from 'react-router/es6';
import render from './render';

import routes from '../../../config/routes'; // eslint-disable-line

function boldrSSR(request, response) {
  if (process.env.DISABLE_SSR) {
    if (process.env.NODE_ENV === 'development') {
      console.log('==> 🐌  Handling react route without SSR');  // eslint-disable-line no-console
    }

    const html = render();
    response.status(200).send(html);
    return;
  }

  const history = createMemoryHistory(request.originalUrl);

  match({ routes, history }, (error, redirectLocation, renderProps) => {
    if (error) {
      response.status(500).send(error.message);
    } else if (redirectLocation) {
      response.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const html = render({ rootElement: <RouterContext { ...renderProps } /> });
      response.status(200).send(html);
    } else {
      response.status(404).send('Not found');
    }
  });
}

export default boldrSSR;
