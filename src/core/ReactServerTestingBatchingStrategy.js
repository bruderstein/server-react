/**
 * Copyright 2015 Dave Brotherstone
 * Adapted from ReactDefaultBatchingStrategy,  Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * This batching strategy is an adaptation of the ReactDefaultBatchingStrategy to
 * use on the server. This is generally only useful for the tests (such that the
 * standard React test suite works with server-react) - the tests generally expect
 * updates to happen, without manual intervention.
 *
 * On the server, you'd typically use ReactServerBatchingStrategy, and utilise
 * React.withServerContext(...) to get a react instance where you can call
 * react.performUpdates() when you know you're ready for a render.
 *
 * @providesModule ReactServerTestingBatchingStrategy
 */

'use strict';

var ReactUpdates = require('ReactUpdates');
var Transaction = require('Transaction');

var assign = require('Object.assign');
var emptyFunction = require('emptyFunction');

var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function() {
    ReactServerTestingBatchingStrategy.isBatchingUpdates = false;
  }
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function () {
    ReactUpdates.flushBatchedUpdates(this._serverContext);
  }
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

function ReactServerTestingBatchingStrategyTransaction(serverContext) {
  this.reinitializeTransaction();
  this._serverContext = serverContext;

}

assign(
  ReactServerTestingBatchingStrategyTransaction.prototype,
  Transaction.Mixin,
  {
    getTransactionWrappers: function() {
      return TRANSACTION_WRAPPERS;
    }
  }
);


var ReactServerTestingBatchingStrategy =  {
  isBatchingUpdates: false,

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  batchedUpdates: function (callback, serverContext, a, b, c, d) {
    var alreadyBatchingUpdates = this.isBatchingUpdates;

    this.isBatchingUpdates = true;

    if (!serverContext) {
      console.log('batchUpdates called without valid serverContext ');
    }
    // The code is written this way to avoid extra allocations
    if (alreadyBatchingUpdates) {
      callback(a, b, c, d);
    } else {
      var transaction = new ReactServerTestingBatchingStrategyTransaction(serverContext);
      transaction.perform(callback, null, a, b, c, d);
    }
  }
};

module.exports = ReactServerTestingBatchingStrategy;
