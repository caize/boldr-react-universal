import http from 'http';
import Debug from 'debug';
import app from './server';

const debug = Debug('boldr:server');
// Create an http server and listener
const server = http.createServer(app);
// Create socket listener
const port = normalizePort(3000);
debug('listening');

server.listen(3000);
server.on('error', onError);
server.on('listening', onListening);


process.on('uncaughtException', err => {
  console.error(err);
  console.log(err.stack);
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 * @param error   the error object
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port; // eslint-disable-line
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `pipe ${addr.port}`;
}

export default server;
