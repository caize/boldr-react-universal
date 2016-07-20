/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config({
  silent: true
});

function getExternals() {
  const nodeModules = fs.readdirSync(path.join(process.cwd(), 'node_modules')) // eslint-disable-line
  return nodeModules.reduce(function(ext, mod) { // eslint-disable-line
    ext[mod] = 'commonjs ' + mod // eslint-disable-line
    return ext // eslint-disable-line
  }, {}) // eslint-disable-line
}
const ROOT_DIR = path.resolve(__dirname, '../../');
const webpackConfig = module.exports = {
  target: 'node',
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filaname: true,
    __dirname: true,
    fs: true,
    path: true
  },
  externals: getExternals(),
  context: path.resolve(__dirname, '../../'),
  devtool: 'source-map',
  entry: {
    server: [
      path.join(process.cwd(), 'src', 'server', 'index.js')
    ]
  },
  output: {
    path: path.resolve(path.join(ROOT_DIR, 'dist')),
    publicPath: '/',
    chunkFilename: '[name]-[chunkhash].js',
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json'
    ],
    mainFields: ['jsnext:main', 'main']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
      __DEV__: process.env.NODE_ENV !== 'production',
      __DISABLE_SSR__: false,
      __CLIENT__: false,
      __SERVER__: true
    }),
    //
    // new AssetsPlugin({
    //   filename: 'assets.json',
    //   path: path.join(process.cwd(), 'build', 'server')
    // }),

    new webpack.NoErrorsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.optimize.DedupePlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          presets: ['react', 'es2015-webpack', 'stage-0'],
          compact: 'auto'
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loaders: [
          {
            loader: 'fake-style-loader'
          },
          {
            loader: 'css-loader',
            query: {
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
      },
      {
        test: /\.scss$/,
        loaders: [
          {
            loader: 'fake-style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
};
