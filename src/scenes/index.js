const errorLoading = (err) => {
  console.error('⚠️  Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default (store) => {
  return {
    path: '/',
    component: require('../components/tpl.CoreLayout').default,
    indexRoute: {
      component: require('./Home').default
    },
    childRoutes: [{
      path: 'about',
      getComponent(nextState, cb) {
        System.import('./About')
          .then(loadModule(cb))
          .catch(errorLoading);
      }
    }]
  };
};
