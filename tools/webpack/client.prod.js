import path from 'path';
import webpack from 'webpack';
import dotenv from 'dotenv';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import {
  ROOT_DIR, SRC_DIR, NODE_MODULES_DIR, VENDOR_PREFIXES, VENDOR, ASSETS_DIR
} from '../constants';

import isomorphicConfig from './isomorphic.config';

dotenv.config({ silent: true });


const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(isomorphicConfig);

const clientProdConfig = {
  target: 'web',
  node: {
    __dirname: true,
    __filename: true
  },
  devtool: 'hidden-source-map',
  context: ROOT_DIR,
  entry: {
    main: path.join(SRC_DIR, 'client.js'),
    vendor: VENDOR
  },
  output: {
    path: ASSETS_DIR,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/assets/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [NODE_MODULES_DIR],
        query: {
          cacheDirectory: false,
          compact: 'auto',
          babelrc: false,
          presets: [
            'es2015-webpack',
            'react',
            'stage-0',
            'react-optimize'
          ],
          plugins: [['transform-runtime', { polyfill: true, regenerator: false }],
            'transform-decorators-legacy']
        }
      },
      { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          notExtractLoader: 'style-loader',
          loader: 'css-loader?modules&sourceMap&minimize=false&localIdentName=[local]-[hash:base62:6]!postcss-loader'
        })
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    root: ROOT_DIR,
    modulesDirectories: ['src', 'node_modules'],
    alias: {
      react$: require.resolve(path.join(NODE_MODULES_DIR, 'react'))
    }
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
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
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
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports?self.fetch!whatwg-fetch'
    }),
    // needed for long-term caching
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      }
    }),
    // merge common
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin({ filename: '[name]-[chunkhash].css', allChunks: true }),
    webpackIsomorphicToolsPlugin
  ]
};
module.exports = clientProdConfig;
