/* eslint-disable no-console */ /* eslint-disable no-unneeded-ternary */
/* eslint-disable quote-props */
import path from 'path';
import Debug from 'debug';
import webpack from 'webpack';
import dotenv from 'dotenv';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';

import config from '../config';
import isomorphicConfig from './isomorphic.config';

const debug = Debug('boldr:webpack:client');
dotenv.config({ silent: true });


const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(isomorphicConfig);

const { ROOT_DIR, WP_HOST, WP_DS, disableSSR, SERVER_PORT, DIST_DIR,
ASSETS_DIR } = config;

const LOCAL_DEV = process.env.NODE_ENV === 'development';

const BABELQUERY = {
  babelrc: false,
  cacheDirectory: true,
  // Do not include superfluous whitespace characters and line terminators.
  // When set to "auto" compact is set to true on input sizes of >100KB.
  compact: 'auto',
  presets: ['react-hmre', 'react', 'es2015-webpack', 'stage-0'],
  plugins: ['react-hot-loader/babel', 'transform-decorators-legacy']
};

const HMR = `webpack-hot-middleware/client?reload=true&path=http://${WP_HOST}:${WP_DS}/__webpack_hmr`;
debug('Webpack is reading the client configuration.');
const webpackConfig = {
  target: 'web',
  node: {
    __dirname: true,
    __filename: true
  },
  devtool: 'cheap-module-eval-source-map',
  context: ROOT_DIR,
  entry: {
    main: [
      'react-hot-loader/patch',
      HMR,
      path.resolve('src', 'client.js')
    ],
    vendor: config.VENDOR
  },
  output: {
    path: ASSETS_DIR,
    filename: '[name].js',
    chunkFilename: '[name]-chunk.js',
    publicPath: `http://localhost:3001/${DIST_DIR}/`

  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json'
    ],
    alias: {
      components: path.resolve(ROOT_DIR, 'src/components'),
      scenes: path.resolve(ROOT_DIR, 'src/scenes'),
      core: path.resolve(ROOT_DIR, 'src/core')
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: BABELQUERY
      },
      {
        test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|mp4|mp3|ogg|pdf)$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loaders: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            query:
            {
              sourceMap: true,
              modules: true,
              localIdentName: '[local]-[hash:base62:6]',
              minimize: false
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  },
  postcss(webpack) {
    return [
      require('postcss-import')({ addDependencyTo: webpack }),
      require('postcss-url')()
    ];
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PORT: JSON.stringify(SERVER_PORT)
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
    new webpack.NoErrorsPlugin(),
    webpackIsomorphicToolsPlugin.development(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = webpackConfig;
