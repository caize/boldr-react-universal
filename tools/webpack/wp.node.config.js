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
  devtool: 'source-map',
  entry: {
      main: [
        path.join(process.cwd(), 'src', 'server.js')
      ]
    },
  output: {
    path: path.join(process.cwd(), 'build', 'server'),
    chunkFilename: '[name]-[chunkhash].js',
    filename: '[name].js',
    publicPath: `http://localhost:${process.env.WP_DS}/assets/`,
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
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PORT: JSON.stringify(process.env.PORT),
        WP_DS: JSON.stringify(process.env.WP_DS),
        DISABLE_SSR: process.env.DISABLE_SSR,
        WEBSITE_TITLE: JSON.stringify(process.env.WEBSITE_TITLE),
        WEBSITE_DESCRIPTION: JSON.stringify(process.env.WEBSITE_DESCRIPTION)
      },
      '__DEV__': process.env.NODE_ENV === 'development'
    },
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
        exclude: [/node_modules/, path.resolve(process.cwd(), './build')],
        query: {
          presets: ['react', 'es2015-webpack', 'stage-0'],
          env: {
            development: {
              plugins: ['react-hot-loader/babel']
            }
          },
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
