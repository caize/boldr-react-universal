/* eslint-disable no-console */

const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const dotenv = require('dotenv');

dotenv.config({ silent: true });

const { ifElse, removeEmpty, merge } = require('../helpers');

function wpConfig({ target, mode }) {
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isClient = target === 'client';
  const isServer = target === 'server';

  const ifDev = ifElse(isDev);
  const ifProd = ifElse(isProd);
  const ifServer = ifElse(isServer);
  const ifDevClient = ifElse(isDev && isClient);

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
          ifDevClient('react-hot-loader/patch'),
          ifDevClient(`webpack-hot-middleware/client?reload=true&path=http://localhost:${process.env.WP_DS}/__webpack_hmr`),
          path.join(process.cwd(), 'src', 'client.js')
        ]),
        vendor: removeEmpty([
          'react',
          'react-dom',
          'react-router'
        ])
      }
    ),
    output: {
      path: path.join(process.cwd(), 'build', 'client'),
      filename: ifProd(
        '[name]-[hash].js',
        '[name].js'
      ),
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: ifDev(
        `http://localhost:${process.env.WP_DS}/assets/`,
        '/assets/'
      )
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
        path: path.join(process.cwd(), 'build', 'client')
      }),

      ifDev(new webpack.NoErrorsPlugin()),
      ifDev(new webpack.HotModuleReplacementPlugin()),
      ifProd(
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        })
      ),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        children: true,
        minChunks: 2,
        async: true
      }),
      ifProd(
        // JS Minification.
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true,
            warnings: false
          }
        })
      ),

      ifProd(
        new webpack.optimize.DedupePlugin()
      ),

      ifProd(
        new ExtractTextPlugin({ filename: '[name]-[chunkhash].css', allChunks: true })
      )
    ]),
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: [/node_modules/, path.resolve(process.cwd(), './build')],
          query: {
            presets: [
              'react',
              'es2015-webpack'
            ],
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

        // CSS
        merge(
          { test: /\.css$/ },
          ifProd({
            loader: ExtractTextPlugin.extract({
              notExtractLoader: 'style-loader',
              loader: 'css-loader'
            })
          }),
          ifDev({
            loaders: [
              'style-loader',
              { loader: 'css-loader', query: { sourceMap: true } }
            ]
          })
        )
      ]
    }
  };
}

module.exports = wpConfig;
