import path from 'path';
import Debug from 'debug';
import webpack from 'webpack';
import dotenv from 'dotenv';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';

import config from '../config';
import isomorphicConfig from './isomorphic.config';

const debug = Debug('boldr:webpack:clientProd');
dotenv.config({ silent: true });


const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(isomorphicConfig);

const { ROOT_DIR, WP_HOST, WP_DS, disableSSR, SERVER_PORT, DIST_DIR } = config;
const ASSETS_PATH = path.resolve(ROOT_DIR, './static/assets');
const webpackConfig = module.exports = {
  target: 'web',
  node: {
    __dirname: true,
    __filename: true
  },
  devtool: 'hidden-source-map',
  entry: {
    main: path.join(process.cwd(), 'src', 'client.js'),
    vendor: config.VENDOR
  },
  output: {
    path: ASSETS_PATH,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/assets/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, path.resolve(process.cwd(), './dist')],
        query: {
          cacheDirectory: false,
          presets: [
            'react',
            'es2015-webpack',
            'stage-0',
            'react-optimize'
          ],
          plugins: ['transform-decorators-legacy'],
          compact: 'auto'
        }
      },
      {
        test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|mp4|mp3|ogg|pdf)$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      { test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          notExtractLoader: 'style-loader',
          loader: 'css-loader?modules&sourceMap&minimize=false&localIdentName=[local]-[hash:base62:6]!postcss-loader'
        })
      }
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json'
    ],

    alias: {
      components: path.resolve(ROOT_DIR, './src/components'),
      src: path.join(ROOT_DIR, './src'),
      state: path.resolve(ROOT_DIR, './src/state'),
      scenes: path.resolve(ROOT_DIR, './src/scenes'),
      core: path.resolve(ROOT_DIR, './src/core')
    }
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
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin({ filename: '[name]-[chunkhash].css', allChunks: true }),
    webpackIsomorphicToolsPlugin
  ]
};
