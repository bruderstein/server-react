/**
 * Copyright 2015 Dave Brotherstone
 * React Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * ReactServerContext creates a ServerContext object which contains all
 * the properties that are normally singletons (or statics) for "browser"
 * (normal) React.
 *
 * @providesModule ReactServerContext
 */

function ReactServerContext(document) {

  this.document = document;
  // From ReactUpdates / ReactUpdateQueue
  this.updateQueue = [];
  this.markupQueue = [];
  this.dirtyComponents = [];

  // From ReactMount
  this.instancesByReactRootID = {};
  this.rootElementsByReactRootID = {};
  this.containersByReactRootID = {};
  this.nodeCache = {};
  this.findComponentRootReusableArray = [];

  if (__DEV__) {
    /** __DEV__-only mapping from reactRootID to root elements. */
    this.rootElementsByReactRootID = {};

  }

}

module.exports = ReactServerContext;