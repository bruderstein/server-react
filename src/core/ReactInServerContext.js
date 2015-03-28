/**
 * Copyright 2015 Dave Brotherstone
 * Adapted from ReactDefaultBatchingStrategy & ReactRAFBatchingStrategy,
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInServerContext
 */

var ReactServerBatchingStrategy = require('ReactServerBatchingStrategy');
var ReactServerContext = require('ReactServerContext');

var ReactInServerContext = {
  inServerContext: function (document, callback) {
    var React = require('React');
    var react = Object.create(React);
    var serverContext = new ReactServerContext(document);

    react.render = function (element, container, callback) {
      return React.render(element, container, serverContext, callback);
    };

    react.unmountComponentAtNode = function (component) {
      return React.unmountComponentAtNode(serverContext, component);
    };

    react.performUpdates = function () {
      ReactServerBatchingStrategy.performUpdates(serverContext);
    };

    // Expose serverContext to aid with tests
    react.serverContext = serverContext;

    if (callback) {
      callback(react, serverContext);
    }
    return react;
  }

};

module.exports = ReactInServerContext;
