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
