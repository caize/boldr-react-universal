/* eslint-disable no-console */

const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const dotenv = require('dotenv');

dotenv.config({ silent: true });

const { ifElse, removeEmpty, merge } = require('../helpers');


function wpConfig({ target, mode }, { json }) {
  if (!json) {
    console.log(`==> ℹ️  Creating webpack "${target}" config in "${mode}" mode`);
  }
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isServer = target === 'server';

  const ifDev = ifElse(isDev);
  const ifProd = ifElse(isProd);
  const ifServer = ifElse(isServer);

  return {
    target: ifServer('node', 'web'),
    node: {
      __dirname: true,
      __filename: true
    },
    externals: removeEmpty([
      ifServer(nodeExternals({
        binaryDirs: [
          'normalize.css'
        ]
      }))
    ]),
    devtool: ifElse(isServer || isDev)(
      'source-map',
      'hidden-source-map'
    ),
    entry: merge(
      {
        main: removeEmpty([
          path.join(process.cwd(), 'src', 'server.js')
        ])
      }
    ),
    output: {
      path: path.join(process.cwd(), 'build', 'server'),
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: ifDev(
        `http://localhost:${process.env.WP_DS}/assets/`,
        '/assets/'
      ),
      libraryTarget: 'commonjs2'
    },
    resolve: {
      extensions: [
        '.js',
        '.jsx',
        '.json'
      ]
    },
    plugins: removeEmpty([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(mode),
          PORT: JSON.stringify(process.env.PORT),
          WP_DS: JSON.stringify(process.env.WP_DS),
          DISABLE_SSR: process.env.DISABLE_SSR,
          WEBSITE_TITLE: JSON.stringify(process.env.WEBSITE_TITLE),
          WEBSITE_DESCRIPTION: JSON.stringify(process.env.WEBSITE_DESCRIPTION)
        }
      }),

      new AssetsPlugin({
        filename: 'assets.json',
        path: path.join(process.cwd(), 'build', 'server')
      }),

      ifDev(new webpack.NoErrorsPlugin()),
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
      ifProd(
        new webpack.optimize.DedupePlugin()
      )
    ]),
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: [/node_modules/, path.resolve(process.cwd(), './build')],
          query: {
            presets: ['react'],
            env: {
              development: {
                plugins: ['react-hot-loader/babel']
              }
            }
          }
        },
        // JSON
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.css$/,
          loaders: [
            'fake-style-loader',
            'css-loader'
          ]
        }
      ]
    }
  };
}

module.exports = wpConfig;
