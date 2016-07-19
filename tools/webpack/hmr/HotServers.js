const path = require('path');
const process = require('process');
const chokidar = require('chokidar');
const webpack = require('webpack');
const helper = require('../../util/helpers');
const HotServer = require('./HotServer');
const HotClient = require('./HotClient');

const CWD = process.cwd();

class HotServers {
  constructor(root) {
    this.root = root;

    // Bind our functions to avoid any scope/closure issues.
    this.start = this.start.bind(this);
    this.restart = this.restart.bind(this);
    this._configureHotClient = this._configureHotClient.bind(this);
    this._configureHotServer = this._configureHotServer.bind(this);

    this.clientBundle = null;
    this.clientCompiler = null;
    this.serverBundle = null;
    this.serverCompiler = null;

    // Any changes to our webpack config builder will cause us to restart our
    // hot servers.
    console.log(`Restarting hot servers when files in "${path.relative(CWD, __dirname)}" are modified.`);
    const watcher = chokidar.watch(
      path.resolve(__dirname)
    );
    watcher.on('ready', () => {
      watcher.on('change', this.restart);
    });
  }

  start() {
    try {
      const clientConfigPath = path.resolve(this.root, 'webpack.client.config');
      const clientConfig = require(clientConfigPath)({
        mode: 'development'
      });
      this.clientCompiler = webpack(clientConfig);

      const serverConfigPath = path.resolve(this.root, 'webpack.server.config');
      const serverConfig = require(serverConfigPath)({
        mode: 'development'
      });
      this.serverCompiler = webpack(serverConfig);
    } catch (err) {
      helper.createNotification({
        title: 'Webpack',
        message: 'Error: Webpack config invalid, check console for error'
      });
      console.error(err);

      return;
    }

    this._configureHotClient();
    this._configureHotServer();
  }

  restart() {
    const clearWebpackConfigsCache = () => {
      Object.keys(require.cache).forEach(modulePath => {
        if (~modulePath.indexOf('webpack')) {
          delete require.cache[modulePath];
        }
      });
    };

    Promise.all([
      this.serverBundle ? this.serverBundle.dispose() : undefined,
      this.clientBundle ? this.clientBundle.dispose() : undefined
    ]).then(clearWebpackConfigsCache).then(this.start, err => console.log(err));
  }

  _configureHotClient() {
    this.clientCompiler.plugin('done', stats => {
      if (stats.hasErrors()) {
        helper.createNotification({
          title: 'Client',
          message: 'Error: Build failed, check console for error'
        });
        console.log(stats.toString());
      } else {
        helper.createNotification({
          title: 'Client',
          message: 'Built'
        });
      }
    });

    this.clientBundle = new HotClient(this.clientCompiler);
  }

  _configureHotServer() {
    const compileHotServer = () => {
      const runCompiler = () => this.serverCompiler.run(() => undefined);

      // Shut down any existing running server if necessary before starting the
      // compile, else just compile.
      if (this.serverBundle) {
        this.serverBundle.dispose().then(runCompiler);
      } else {
        runCompiler();
      }
    };

    this.clientCompiler.plugin('done', stats => {
      if (!stats.hasErrors()) {
        compileHotServer();
      }
    });

    this.serverCompiler.plugin('done', stats => {
      if (stats.hasErrors()) {
        helper.createNotification({
          title: 'Server',
          message: 'Error: Build failed, check console for error'
        });

        console.error(stats.toString());
        return;
      }

      helper.createNotification({
        title: 'Server',
        message: 'Built'
      });

      // Make sure our newly built server bundles aren't in the module cache.
      Object.keys(require.cache).forEach(modulePath => {
        if (~modulePath.indexOf(this.serverCompiler.options.output.path)) {
          delete require.cache[modulePath];
        }
      });

      this.serverBundle = new HotServer(this.serverCompiler);
    });

    // Now we will configure `chokidar` to watch our server specific source folder.
    // Any changes will cause a rebuild of the server bundle.
    const serverConfigRoot = path.resolve(this.root, './src/server');
    console.log(`Recompiling hot servers when files in "${path.relative(CWD, serverConfigRoot)}" are modified.`);

    this.watcher = chokidar.watch([
      serverConfigRoot
    ]);

    this.watcher.on('ready', () => {
      this.watcher
        .on('add', compileHotServer)
        .on('addDir', compileHotServer)
        .on('change', compileHotServer)
        .on('unlink', compileHotServer)
        .on('unlinkDir', compileHotServer);
    });
  }
}

module.exports = HotServers;
