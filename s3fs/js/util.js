// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/* jshint unused: false */

'use strict';

/**
 * Extends a destination object with the properties of one or more source
 * objects.
 * @param {Object} destination The destination object.
 * @param {...Object} var_sources One or more source objects.
 * @return {Object} The original destination object, with all the additional
 *     properties from the source objects.
 */
var extend = function(destination, var_sources) {
  var sources = Array.prototype.slice.call(arguments, 1);

  sources.forEach(function(source) {
    if (!source) { return; }

    for (var property in source) {
      destination[property] = source[property];
    }
  });

  return destination;
};

/**
 * Creates a metadata object representing a directory.
 * @param {string} name The name of the directory.
 * @return {Object} A plain object representing a directory with the given name
 *     in the file system provider API.
 */
var makeDirectory = function(name) {
  return {
    isDirectory: true,
    name: name,
    size: 0,
    modificationTime: new Date(0),
  };
};

module.exports = {
  extend: extend,
  makeDirectory: makeDirectory
};
