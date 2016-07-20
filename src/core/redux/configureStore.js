import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import clientMiddleware from '../middleware/clientMiddleware';
import reducers from './reducers';

export default function configureStore(history, client, data) {
  const middleware = [thunk, clientMiddleware(client), routerMiddleware(history)];
  let store;

  if (__DEV__) {
    middleware.push(logger);
    store = createStore(reducers, data, compose(
    applyMiddleware(...middleware),
    devTools
  ));
  } else {
    store = createStore(reducers, data, compose(applyMiddleware(...middleware), f => f));
  }
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers');

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

// Redux Devtools Chrome extension
// https://github.com/zalmoxisus/redux-devtools-extension
const devTools = typeof window === 'object' &&
  typeof window.devToolsExtension !== 'undefined' ?
  window.devToolsExtension() : f => f;
// Redux logger
// https://github.com/evgenyrodionov/redux-logger
// @NOTE Replace predicate: (getState, action) => action.type !== '@@router/LOCATION_CHANGE'
// with predicate: (getState, action) => true
// to see react router logs. I find this distracting when working simulatenously on
// the server.
const logger = createLogger({
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: (getState, action) => action.type !== '@@router/LOCATION_CHANGE'
});
