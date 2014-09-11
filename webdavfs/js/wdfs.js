// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var WebDAVClient = require('./client');

var client = new WebDAVClient();

/**
 * Class to encapsulate data relating to the WebDAV file system.
 * @class
 * @param {string} url The URL of the WebDAV server to which the client will
 *     connect.
 */
var WebDAVFS = function(url) {
  if (url === '') {
    throw new Error('Invalid host URL: string must not be empty.');
  }

  if (url.charAt(url.length - 1) !== '/') {
    url += '/';
  }

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
 *     @param {string} path Path to the file to be read, relative to the server
 *         root.
 *     @param {function} onSuccess Function to be called with the contents
 *         of the file if the request succeeds.
 *     @param {function} onError Function to be called with the error if
 *         the request fails.
 */
WebDAVFS.prototype.readFile = function(options) {
  var url = this.url + options.path;
  var headers = null;

  if (options.range && (options.range.start || options.range.end)) {
    var rangeString = 'bytes=';
    var start = options.range.start;
    var end = options.range.end;

    rangeString += start ? start : '';
    rangeString += '-';
    rangeString += end ? end : '';

    headers = {
      Range: rangeString
    };
  }

  client.get(url, headers, options.onSuccess, options.onError);
};

/**
 * Writes the given ArrayBuffer to the file at the given path.
 * @param {Object} options Input options.
 *     @param {string} path Path to the file to write, relative to the server
 *         root.
 *     @param {ArrayBuffer} data The data to write.
 *     @param {function} onSuccess Function to be called if the request succeeds.
 *     @param {function} onError Function to be called with the error if
 *         the request fails.
 */
WebDAVFS.prototype.writeFile = function(options) {
  var url = this.url + options.path;
  var headers = null;

  client.put(url, options.data, headers, options.onSuccess, options.onError);
};

/**
 * Deletes the file or directory at the given path.
 * @param {Object} options Input options.
 *     @param {string} path Path to the entry to delete, relative to the server
 *         root.
 *     @param {function} onSuccess Function to be called if the request succeeds.
 *     @param {function} onError Function to be called with the error if
 *         the request fails.
 */
WebDAVFS.prototype.deleteEntry = function(options) {
  var url = this.url + options.path;
  var headers = null;

  client.delete(url, headers, options.onSuccess, options.onError);
};


/**
 * Returns the metadata of the specified file or directory.
 * @param {Object} options Input options.
 *     @param {string} path Path to the file to retrieve the metadata for,
 *         relative to the server root.
 *     @param {function} onSuccess Function to be called with the metadata
 *         if the request succeeds.
 *     @param {function} onError Function to be called with the error if
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
 * Copies the file or directory at the source path to the target path.
 * @param {Object} options Input options.
 *     @param {string} sourcePath Path to the file to copy.
 *     @param {string} targetPath Path to the file new file to copy to.
 *     @param {function} onSuccess Function to be called if the request
 *         succeeds.
 *     @param {function} onError Function to be called with the error if
 *         the request fails.
 */
WebDAVFS.prototype.copyEntry = function(options) {
  client.copy(this.url + options.sourcePath, this.url + options.targetPath,
    options.onSuccess, options.onError);
};

/**
 * Moves the file or directory at the source path to the target path.
 * @param {Object} options Input options.
 *     @param {string} sourcePath Path to the entry to move.
 *     @param {string} targetPath Path to the location to the move the entry to.
 *     @param {function} onSuccess Function to be called if the request
 *         succeeds.
 *     @param {function} onError Function to be called with the error if
 *         the request fails.
 */
WebDAVFS.prototype.moveEntry = function(options) {
  client.move(this.url + options.sourcePath, this.url + options.targetPath,
    options.onSuccess, options.onError);
};

/**
 * Returns all files and folders that are immediate children of the specified
 *  directory.
 * @param {Object} options Input options.
 *     @param {string} path Path to the directory to list the contents of,
 *         relative to the server root.
 *     @param {function} onSuccess Function to be called with the array of
 *         child entries if the request succeeds.
 *     @param {function} onError Function to be called with the error if
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
