function removeEmpty(x) {
  return x.filter(function (y) {
    return !!y;
  });
}

function ifElse(condition) {
  return function (then, or) {
    return condition ? then : or;
  };
}

function merge() {
  var funcArgs = Array.prototype.slice.call(arguments); // eslint-disable-line prefer-rest-params

  return Object.assign.apply(null, removeEmpty([{}].concat(funcArgs)));
}

exports.merge = merge;
exports.ifElse = ifElse;
exports.removeEmpty = removeEmpty;
