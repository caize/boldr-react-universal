const path = require('path');

const config = {
  ROOT_DIR: path.resolve(__dirname, '..'),
  DIST_DIR: 'build',
  ASSETS_DIR: path.resolve(process.cwd(), 'build'),
  SERVER_PORT: process.env.SERVER_PORT || 3000,
  WP_HOST: 'localhost',
  WP_DS: process.env.WP_DS || 3001,
  disableSSR: process.env.DISABLE_SSR || false,
  APP_NAME: process.env.APP_NAME || 'Boldr Universal React Starter',
  VENDOR: [
    'react',
    'react-dom',
    'react-router',
    'redux',
    'react-redux',
    'react-router-redux',
    'react-helmet',
    'redux-thunk',
    'redial'
  ]

};

module.exports = config;
