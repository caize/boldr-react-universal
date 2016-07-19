const wpConfig = require('./tools/webpack/wp.node.config.js');

module.exports = function wpServerConfig(options = {}, args = {}) {
  const { mode = 'development' } = options;
  return wpConfig({ target: 'server', mode, root: __dirname }, args);
};
