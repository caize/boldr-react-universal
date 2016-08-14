/* eslint-disable no-console */
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const appRoot = require('app-root-path');
const NodeExternals = require('webpack-node-externals');

const appRootPath = appRoot.toString();
const NODE_MODULES_DIR = path.resolve(appRootPath, './node_modules');
dotenv.config({
  silent: true
});

const nodeConfig = { // eslint-disable-line
  target: 'node',
  stats: false, // Don't show stats in the console
  progress: true,
  externals: NodeExternals({ whitelist: [
    /\.(eot|woff|woff2|ttf|otf)$/,
    /\.(svg|png|jpg|jpeg|gif|ico)$/,
    /\.(mp4|mp3|ogg|swf|webp)$/,
    /\.(css|scss|sass|sss|less)$/
  ] }),
  context: appRootPath,
  devtool: 'source-map',
  entry: {
    server: [
      path.join(appRootPath, 'src', 'server', 'index.js')
    ]
  },
  output: {
    path: path.join(appRootPath, 'build'),
    publicPath: '/',
    chunkFilename: '[name]-[chunkhash].js',
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    mainFields: ['jsnext:main', 'main']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: NODE_MODULES_DIR
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.css$/,
        loaders: [
          'css-loader/locals',
          'postcss'
        ]
      },
      { test: /\.scss$/,
        loaders: [
          'css-loader/locals',
          'postcss',
          'sass'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        SERVER_PORT: parseInt(process.env.SERVER_PORT, 10)
      },
      __DEV__: process.env.NODE_ENV !== 'production',
      __DISABLE_SSR__: false,
      __CLIENT__: false,
      __SERVER__: true
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.optimize.DedupePlugin()
  ],
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filaname: true,
    __dirname: true,
    fs: true,
    path: true
  }
};
module.exports = nodeConfig;
