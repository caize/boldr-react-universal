/* eslint-disable no-console */ /* eslint-disable no-unneeded-ternary */
/* eslint-disable quote-props */
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const appRoot = require('app-root-path');
const WebpackNotifierPlugin = require('webpack-notifier');
const HappyPack = require('happypack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const isomorphicConfig = require('./isomorphic.config');

const appRootPath = appRoot.toString();
const NODE_MODULES_DIR = path.resolve(appRootPath, './node_modules');

const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(isomorphicConfig);
const WP_DS = 3001;
const VENDOR = [
  'react',
  'react-dom',
  'react-router',
  'redux',
  'react-redux',
  'react-router-redux',
  'react-helmet',
  'redux-thunk',
  'redial',
  'superagent'
];

dotenv.config({ silent: true });
const HMR = `webpack-hot-middleware/client?reload=true&path=http://localhost:${WP_DS}/__webpack_hmr`;
const clientDevConfig = {
  target: 'web',
  stats: false, // Don't show stats in the console
  progress: true,
  // use either cheap-eval-source-map or cheap-module-eval-source-map.
  // cheap eval is faster than cheap-module
  // see https://webpack.github.io/docs/build-performance.html#sourcemaps
  devtool: 'cheap-module-eval-source-map',
  context: appRootPath,
  entry: {
    main: [
      'react-hot-loader/patch',
      HMR,
      path.join(appRootPath, 'src', 'client.js')
    ],
    vendor: VENDOR
  },
  output: {
    path: path.join(appRootPath, 'public'),
    filename: '[name].js',
    chunkFilename: '[name]-chunk.js',
    publicPath: `http://localhost:${WP_DS}/build/`

  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    root: appRootPath,
    modulesDirectories: ['src', 'node_modules'],
    alias: {
      react$: require.resolve(path.join(NODE_MODULES_DIR, 'react')),
      components: path.join(appRootPath, 'src', 'components'),
      scenes: path.join(appRootPath, 'src', 'scenes'),
      core: path.join(appRootPath, 'src', 'core')
    }
  },
  module: {
    loaders: [
      {
        happy: { id: 'js' },
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: NODE_MODULES_DIR
      },
      { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.css$/,
        loader: 'style!css?-autoprefixer&modules&camelCase&sourceMap&localIdentName=[name]---[local]---[hash:base64:5]!postcss'
      }
    ]
  },
  postcss(webpack) {
    return [
      require('precss')(),
      require('pixrem')(),
      require('lost')(),
      require('cssnano')({
        autoprefixer: {
          add: true,
          remove: true,
          browsers: 'last 2 versions'
        },
        discardComments: {
          removeAll: true
        },
        discardUnused: false,
        mergeIdents: false,
        reduceIdents: false,
        safe: true,
        sourcemap: true
      })
    ];
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        SERVER_PORT: parseInt(process.env.SERVER_PORT, 10)
      },
      __DEV__: process.env.NODE_ENV !== 'production',
      __DISABLE_SSR__: false,
      __CLIENT__: true,
      __SERVER__: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      children: true,
      minChunks: 2,
      async: true
    }),
    new HappyPack({
      id: 'js',
      threads: 4
    }),
    new WebpackNotifierPlugin({ title: '🔥 Webpack' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    webpackIsomorphicToolsPlugin.development()
  ],
  node: {
    __dirname: true,
    __filename: true
  }
};

module.exports = clientDevConfig;
