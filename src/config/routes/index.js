import React from 'react';
import { Route, IndexRoute } from 'react-router/es6';
import App from '../../components/App';

function handleError(err) {
  console.log('==> Error occurred loading dynamic route'); // eslint-disable-line no-console
  console.log(err); // eslint-disable-line no-console
}

function resolveIndexComponent(nextState, cb) {
  System.import('../../components/Home')
    .then(module => cb(null, module.default))
    .catch(handleError);
}

function resolveAboutComponent(nextState, cb) {
  System.import('../../components/About')
    .then(module => cb(null, module.default))
    .catch(handleError);
}

const routes = (
  <Route path="/" component={ App }>
    <IndexRoute getComponent={ resolveIndexComponent } />
    <Route path="about" getComponent={ resolveAboutComponent } />
  </Route>
);

export default routes;
