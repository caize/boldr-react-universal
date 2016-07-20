import React from 'react';
import { Route, IndexRoute } from 'react-router';
import CoreLayout from '../components/tpl.CoreLayout';

function handleError(err) {
  console.log('==> Error occurred loading dynamic route'); // eslint-disable-line no-console
  console.log(err); // eslint-disable-line no-console
}

function resolveIndexComponent(nextState, cb) {
  System.import('./Home')
    .then(module => cb(null, module.default))
    .catch(handleError);
}

function resolveAboutComponent(nextState, cb) {
  System.import('./About')
    .then(module => cb(null, module.default))
    .catch(handleError);
}
export default (store) => {
  if (typeof require.ensure !== 'function') require.ensure = (deps, cb) => cb(require);

  return {
    path: '/',
    component: require('../components/tpl.CoreLayout').default,
    indexRoute: {
      component: require('./Home').default
    },
    childRoutes: [{
      path: 'about',
      getComponent(nextState, cb) {
        console.time('gettingComponent');
        require.ensure([], (require) => {
          cb(null, require('./About').default);
          console.timeEnd('gettingComponent');
        });
      }
    }]
  };
};
