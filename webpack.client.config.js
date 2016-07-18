const wpConfig = require('./tools/webpack/wp.client.config.js');

module.exports = function wpClientConfig(options = {}, args = {}) {
  const { mode = 'development' } = options;
  return wpConfig({ target: 'client', mode }, args);
};
