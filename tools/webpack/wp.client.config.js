require('babel-register');
require('babel-polyfill');

const webpackConfig = require('./client.dev.js');

module.exports = webpackConfig;
