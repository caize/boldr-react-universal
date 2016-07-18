// This grants us source map support, which is handy as our webpack bundling
// for the server will include source maps.  Therefore we will have nice stack
// traces again for our server.
import 'source-map-support/register';
import http from 'http';
import express from 'express';
import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import wpClientConf from '../tools/webpack/wp.client.config.js';
import boldrSSR from './core/ssr/boldrSSR';
// Create our express based server.
const app = express();
const server = http.createServer(app);
// Don't expose any software information to hackers.
app.disable('x-powered-by');

// Prevent HTTP Parameter pollution.
app.use(hpp());

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'"],
  imgSrc: ["'self'"],
  connectSrc: ["'self'", 'ws:'],
  fontSrc: ["'self'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'none'"],
  frameSrc: ["'none'"]
}));
app.use(helmet.xssFilter());
app.use(helmet.frameguard('deny'));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());

// Response compression.
app.use(compression());

// Configure static serving of our webpack bundled client files.
const webpackClientConfig = wpClientConf({ mode: process.env.NODE_ENV });
app.use(
  webpackClientConfig.output.publicPath,
  express.static(webpackClientConfig.output.path));

// Bind our universal react app middleware as the handler for all get requests.
app.get('*', boldrSSR);

// Create an http listener for our express app.
const listener = server.listen(parseInt(process.env.PORT, 10));

if (process.env.NODE_ENV === 'development') {
  console.log(`==> 💚  HTTP Listener is running on port ${process.env.PORT}`); // eslint-disable-line no-console,max-len
}

// We export the listener as it will be handy for our development hot reloader.
export default listener;
