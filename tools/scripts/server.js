#!/usr/bin/env node
require('babel-register');
require('babel-polyfill');
const path = require('path');

const rootDir = path.resolve(__dirname, '..', '..');
/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEV__ = process.env.NODE_ENV !== 'production';

if (!require('piping')({
  hook: true,
  ignore: /(\/\.|~$|\.json|\.scss$)/i
})) {
  return;
}

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/isomorphic.config'))
  .development(process.env.NODE_ENV === 'development')
  .server(rootDir, function() {
    require('../../src/server');
  });

  // const path = require('path');
  // const HotServers = require('../webpack/hmr/HotServers');
  //
  // const ROOT_DIR = path.join(__dirname, '..', '..');
  // const servers = new HotServers(ROOT_DIR);
  // servers.start();
