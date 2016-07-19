const notifier = require('node-notifier');

function removeEmpty(x) {
  return x.filter(function (y) {
    return !!y;
  });
}

function ifElse(condition) {
  return function(then, or) {
    return condition ? then : or;
  };
}

function merge() {
  const funcArgs = Array.prototype.slice.call(arguments); // eslint-disable-line prefer-rest-params

  return Object.assign.apply(null, removeEmpty([{}].concat(funcArgs)));
}

function createNotification(options = {}) {
  notifier.notify({
    title: options.title,
    message: options.message,
    open: options.open
  });

  console.log(`==> ${options.title} -> ${options.message}`);
}

exports.createNotification = createNotification;
exports.merge = merge;
exports.ifElse = ifElse;
exports.removeEmpty = removeEmpty;
