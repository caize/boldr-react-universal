# Boldr React Universal

A **bold** React starter project for your next great universal application.

## Features
- A pleasant developer experience conductive to getting things done
- [Webpack v2](https://github.com/webpack/webpack): With code splitting on routes
- [React-Hot-Loader](https://github.com/gaearon/react-hot-loader): Hot module replacement

## Demo

## Usage

### Development
Getting up and running for development is easy.  

`git clone git@github.com:strues/boldr-react-universal.git`

`cd boldr-react-universal`  

Set the env file `cp example.env .env`

Install the dependencies `npm install`  

Start the development process with `npm run dev`

### Production
Running the two commands below will compile your application and serve the production ready build.

```bash
npm run build  
npm start
```

Your application will start running on port 3000. The server file and source map are outputted into the root of the directory. The client side application is placed in `public/assets`. Express is set to serve public as its static directory.


## Notes
- There is a [problem with postcss-import](https://github.com/postcss/postcss-import/issues/220) and Webpack. It's important that you do **not** update `postcss-import` past version 8.1.0 until it is resolved.

### SCSS Support
- Adding Sass/SCSS support is easy to do. It was kept out of this project to reduce the number of dependencies forced on to everyone.
- First you'll want to `npm install --save-dev node-sass sass-loader`  
- Next open up `tools/webpack/client.dev.js` and find the **css loader**
- Put the following above or below:
```javascript
 { test: /\.scss$/, loader: 'style!css?sourceMap!postcss!sass?sourceMap' }
```
- You will also need to open `tools/webpack/client.prod.js` and add the following to the loaders section
```javascript
  { test: /\.scss$/,
    loader: ExtractTextPlugin.extract({
      notExtractLoader: 'style-loader',
      loader: 'css?sourceMap!postcss!sass?sourceMap'
    })
  }
```

## Resources
-
-

## Alternatives
- [`React Universally`](https://github.com/ctrlplusb/react-universally)  
An ultra low dependency node v6 universal react boilerplate with an amazing dev experience.
- [`React Webpack Node`](https://github.com/choonkending/react-webpack-node)  
Your One-Stop solution for a full-stack app with ES6/ES2015 React.js featuring universal Redux, React Router, React Router Redux Hot reloading, CSS modules, Express 4.x, and multiple ORMs.


## Contributing


## Dependencies
- [better-npm-run](https://github.com/benoror/better-npm-run): Better NPM scripts runner
- [body-parser](https://github.com/expressjs/body-parser): Node.js body parsing middleware
- [compression](https://github.com/expressjs/compression): Node.js compression middleware
- [debug](https://github.com/visionmedia/debug): small debugging utility
- [express](https://github.com/expressjs/express): Fast, unopinionated, minimalist web framework
- [lodash](https://github.com/lodash/lodash): Lodash modular utilities.
- [react](https://github.com/facebook/react): React is a JavaScript library for building user interfaces.
- [react-dom](https://github.com/facebook/react): React package for working with the DOM.
- [react-helmet](https://github.com/nfl/react-helmet): A document head manager for React
- [react-redux](https://github.com/reactjs/react-redux): Official React bindings for Redux
- [react-router](https://github.com/reactjs/react-router): A complete routing library for React
- [react-router-redux](https://github.com/reactjs/react-router-redux): Ruthlessly simple bindings to keep react-router and redux in sync
- [redial](https://github.com/markdalgleish/redial): Universal data fetching and route lifecycle management for React etc.
- [redux](https://github.com/reactjs/redux): Predictable state container for JavaScript apps
- [redux-logger](https://github.com/fcomb/redux-logger): Logger for redux
- [redux-thunk](https://github.com/gaearon/redux-thunk): Thunk middleware for Redux.
- [serialize-javascript](https://github.com/yahoo/serialize-javascript): Serialize JavaScript to a superset of JSON that includes regular expressions and functions.
- [source-map-support](https://github.com/evanw/node-source-map-support): Fixes stack traces for files with source maps
- [superagent](https://github.com/visionmedia/superagent): elegant &amp; feature rich browser / node HTTP with a fluent API
- [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools): Transforms CSS-alike text into a React style JSON object
