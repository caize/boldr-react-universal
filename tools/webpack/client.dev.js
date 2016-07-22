/* eslint-disable no-console */ /* eslint-disable no-unneeded-ternary */
/* eslint-disable quote-props */
import path from 'path';
import webpack from 'webpack';
import dotenv from 'dotenv';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';

import { ROOT_DIR, SRC_DIR, WP_DS, NODE_MODULES_DIR, VENDOR_PREFIXES, VENDOR, BUILD_DIR } from '../constants';

import isomorphicConfig from './isomorphic.config';

dotenv.config({ silent: true });


const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(isomorphicConfig);

const BABELQUERY = {
  babelrc: false,
  cacheDirectory: true,
  // Do not include superfluous whitespace characters and line terminators.
  // When set to "auto" compact is set to true on input sizes of >100KB.
  compact: 'auto',
  presets: ['react-hmre', 'react', 'es2015-webpack', 'stage-0'],
  plugins: [['transform-runtime', { polyfill: true, regenerator: false }],
            'react-hot-loader/babel', 'transform-decorators-legacy']
};

const HMR = `webpack-hot-middleware/client?reload=true&path=http://localhost:${WP_DS}/__webpack_hmr`;
const clientDevConfig = {
  target: 'web',
  stats: false, // Don't show stats in the console
  progress: true,
  // use either cheap-eval-source-map or cheap-module-eval-source-map.
  // cheap eval is faster than cheap-module
  // see https://webpack.github.io/docs/build-performance.html#sourcemaps
  devtool: 'cheap-module-eval-source-map',
  context: ROOT_DIR,
  entry: {
    main: [
      'react-hot-loader/patch',
      HMR,
      path.join(SRC_DIR, 'client.js')
    ],
    vendor: VENDOR
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js',
    chunkFilename: '[name]-chunk.js',
    publicPath: `http://localhost:${WP_DS}/build/`

  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    root: ROOT_DIR,
    modulesDirectories: ['src', 'node_modules'],
    alias: {
      react$: require.resolve(path.join(NODE_MODULES_DIR, 'react')),
      components: path.join(SRC_DIR, 'components'),
      scenes: path.join(SRC_DIR, 'scenes'),
      core: path.join(SRC_DIR, 'core')
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: NODE_MODULES_DIR,
        query: BABELQUERY
      },
      { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.css$/,
        loader: 'style!css?modules&camelCase&sourceMap&localIdentName=[name]---[local]---[hash:base64:5]!postcss'
      }
    ]
  },
  postcss(webpack) {
    return [
      require('postcss-import')(),
      require('postcss-url')(),
      require('postcss-custom-media')(),
      require('postcss-media-minmax')(),
      require('postcss-simple-vars')(),
      require('postcss-nested')(),
      require('pixrem')(),
      require('lost')(),
      require('cssnano')({
        autoprefixer: {
          add: true,
          remove: true,
          browsers: VENDOR_PREFIXES
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
