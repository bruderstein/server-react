var ExecutionEnvironment = require('./lib/ExecutionEnvironment');
ExecutionEnvironment.canUseDOM = false;

var ReactWithAddons = require('./lib/ReactWithAddons');


// Force being able to use the DOM, even though window & document probably
// don't exist yet
ExecutionEnvironment.canUseDOM = true;
ExecutionEnvironment.canUseEventListeners = false;

var ReactInjection = require('./lib/ReactInjection');
var ReactServerBatchingStrategy = require('./lib/ReactServerBatchingStrategy');

// Inject the ReactServerBatchingStrategy to the ReactUpdates object
ReactInjection.Updates.injectBatchingStrategy(ReactServerBatchingStrategy);

var Module = require('module');

var originalRequire = Module.prototype.require;

Module.prototype.require = function require(path) {
  if (path.substr(0, 5) === 'react' && (path.length === 5 || path[5] === '/')) {
    path = 'server-' + path;
  }

  return originalRequire.call(this, path);
};

module.exports = ReactWithAddons;