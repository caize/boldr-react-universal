const path = require('path');

const ListenerManager = require('../../util/listenerManager');
const helper = require('../../util/helpers');

class HotServer {
  constructor(compiler) {
    this.compiler = compiler;
    this.listenerManager = null;

    const compiledOutputPath = path.resolve(
      compiler.options.output.path, `${Object.keys(compiler.options.entry)[0]}.js`
    );

    try {
      this.listenerManager = new ListenerManager(require(compiledOutputPath).default);

      const url = `http://localhost:${process.env.PORT}`;

      helper.createNotification({
        title: 'server',
        message: `🌎  Running on ${url}`,
        open: url
      });
    } catch (err) {
      helper.createNotification({
        title: 'server',
        message: '😵  Bundle invalid, check console for error'
      });
      console.log(err);
    }
  }

  dispose() {
    return Promise.all([
      this.listenerManager ? this.listenerManager.dispose() : undefined
    ]);
  }
}

module.exports = HotServer;
