require('babel-register');
require('babel-polyfill');

const webpackConfig = require('./client.prod.js');

module.exports = webpackConfig;
