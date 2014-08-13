// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var WebDAVClient = require('./client');

var client = new WebDAVClient();

/**
 * Class to encapsulate data relating to the WebDAV file system.
 * @constructs
 * @param {string} url The URL of the WebDAV server to which the client will
 *     connect.
 */
var WebDAVFS = function(url) {
  this.url = url;

  this.options = {
    fileSystemId: 'webdavfs',
    displayName: 'WebDAV'
  };

  this.openedFiles = {};
};

/**
 * Returns the contents of the specified file as an ArrayBuffer.
 * @param {Object} options Input options.
 *     @param {Function} onSuccess Function to be called with the contents
 *         of the file if the request succeeds.
 *     @param {Function} onError Function to be called with the error if
 *         the request fails.
 */
WebDAVFS.prototype.readFile = function(options) {
  client.get(this.url + options.path, options.onSuccess, options.onError);
};

/**
 * Returns the metadata of the specified file or directory.
 * @param {Object} options Input options.
 *     @param {Function} onSuccess Function to be called with the metadata
 *         if the request succeeds.
 *     @param {Function} onError Function to be called with the error if
 *         the request fails.
 */
WebDAVFS.prototype.getMetadata = function(options) {
  // If it's a directory, we only want the directory metadata itself, not
  // that of its children.
  var depth = 0;

  var onSuccess = function(doc) {
    options.onSuccess(client.nodeToEntry(doc));
  };

  client.propertyFind(this.url + options.path, onSuccess, options.onError, depth);
};

/**
 * Returns all files and folders that are immediate children of the specified
 *  directory.
 * @param {Object} options Input options.
 *     @param {Function} onSuccess Function to be called with the array of
 *         child entries if the request succeeds.
 *     @param {Function} onError Function to be called with the error if
 *         the request fails.
 */
WebDAVFS.prototype.readDirectory = function(options) {
  // Converts the WebDAV XML response to the
  var convert = function(xmlDocument) {
    // If the there are no children at all, the directory must not
    // exist, since every directory contains at least a reference
    // to itself and its parent.
    if (xmlDocument.childNodes == null) {
      options.onError('NOT_FOUND');
      return;
    }

    // Exclude the first element - it refers to the current
    // directory itself.
    var nodes = Array.prototype.slice.call(xmlDocument.childNodes, 1);

    // Convert all nodes to entries and return.
    return nodes.map(function(node) {
      return client.nodeToEntry(node);
    });
  };

  // Only show immediate children.
  var depth = 1;

  var onSuccess = function(xmlDocument) {
    options.onSuccess(convert(xmlDocument));
  };

  client.propertyFind(this.url + options.path, onSuccess, options.onError, depth);
};

module.exports = WebDAVFS;
