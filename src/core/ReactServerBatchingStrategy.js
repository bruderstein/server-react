/**
 * Copyright 2015 Dave Brotherstone
 * Adapted from ReactDefaultBatchingStrategy,  Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactServerBatchingStrategy
 */

'use strict';

var ReactUpdates = require('ReactUpdates');

var assign = require('Object.assign');
var emptyFunction = require('emptyFunction');
var invariant = require('invariant');


var ReactServerBatchingStrategy =  {
    isBatchingUpdates: true,

    /**
     * Call the provided function in a context within which calls to `setState`
     * and friends are batched such that components aren't updated unnecessarily.
     */
    batchedUpdates: function (callback, serverContext, a, b, c, d) {

//      invariant(serverContext, 'batchedUpdates called without valid serverContext');

      callback(a, b, c, d);
    },

    performUpdates: function (serverContext) {
      ReactUpdates.flushBatchedUpdates(serverContext);
    }
};

module.exports = ReactServerBatchingStrategy;
