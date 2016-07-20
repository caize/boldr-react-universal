import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

export default function configureStore(history, client, data) {
  const middleware = [thunk, routerMiddleware(history)];
  const enhancers = [];
  if (__DEV__) {
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
  }

  const finalCreateStore = compose(
      applyMiddleware(...middleware),
      ...enhancers
    )(createStore);


  const store = finalCreateStore(reducers, data);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers'));
    });
  }

  return store;
}
