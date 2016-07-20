/* eslint-disable no-console */ /* eslint-disable no-unneeded-ternary */
/* eslint-disable quote-props */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const dotenv = require('dotenv');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

dotenv.config({ silent: true });
const isomorphicToolsConfig = require('./isomorphic.config');

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(isomorphicToolsConfig);

const ROOT_DIR = path.join(__dirname, '..', '..');
const webpackConfig = module.exports = {
  target: 'web',
  node: {
    __dirname: true,
    __filename: true
  },
  devtool: 'hidden-source-map',
  entry: {
    main: path.join(process.cwd(), 'src', 'client.js'),
    vendor: [
      'react',
      'react-dom',
      'react-router'
    ]
  },
  output: {
    path: path.join(process.cwd(), 'build', 'client'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/assets/'
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json'
    ],
    mainFields: ['jsnext:main', 'main'],
    alias: {
      components: path.resolve(ROOT_DIR, 'src/components'),
      src: path.join(ROOT_DIR, 'src'),
      state: path.resolve(ROOT_DIR, 'src/state'),
      scenes: path.resolve(ROOT_DIR, 'src/scenes'),
      core: path.resolve(ROOT_DIR, 'src/core')
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
        PORT: JSON.stringify(process.env.PORT),
        WP_DS: JSON.stringify(process.env.WP_DS),
        WEBSITE_TITLE: JSON.stringify(process.env.WEBSITE_TITLE),
        WEBSITE_DESCRIPTION: JSON.stringify(process.env.WEBSITE_DESCRIPTION)
      },
      '__DEV__': process.env.NODE_ENV === 'development',
      '__DISABLE_SSR__': process.env.DISABLE_SSR
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
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, path.resolve(process.cwd(), './build')],
        query: {
          cacheDirectory: false,
          presets: [
            'react',
            'es2015-webpack',
            'stage-0',
            'react-optimize'
          ],
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
  }
};
