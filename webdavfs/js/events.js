// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/**
 * Responds to a request to close a file.
 * @param {object} options Input options.
 * @param {function} onSuccess Function to be called if the file was closed
 *     successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to close the file.
 */
var onCloseFileRequested = function(options, onSuccess, onError) {
  if (!webDAVFS.openedFiles[options.openRequestId]) {
    onError('INVALID_OPERATION');
  } else {
    delete webDAVFS.openedFiles[options.openRequestId];
    onSuccess();
  }
};

/**
 * Fetches the metadata associated with the file at the given path from the
 * WebDAV server.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the metadata was
 *     fetched successfully.
 * @param {Function} onError Function to be called if an error occured while
 *     attempting to fetch the metadata.
 */
var onGetMetadataRequested = function(options, onSuccess, onError) {
  var path = options.entryPath;

  webDAVFS.getMetadata({
    path: path,
    onSuccess: function(metadata) {
      onSuccess(metadata, false);
    },
    onError: function(error) {
      onError('FAILED');
    }
  });
};

/**
 * Responds to a request to open a file.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the file was opened
 *     successfully.
 * @param {Function} onError Function to be called if an error occured while
 *     attempting to open the file.
 */
var onOpenFileRequested = function(options, onSuccess, onError) {
  if (options.mode !== 'READ' || options.create) {
    onError('INVALID_OPERATION');
  }
  else {
    webDAVFS.openedFiles[options.requestId] = options.filePath;
    onSuccess();
  }
};

/**
 * Constructs an object representing a file for the file system provider.
 * @param {string} name The name of the file.
 * @return {Object} A plain object representing a file with the given name in
 *     the file system provider API.
 */
var makeFile = function(name) {
  // TODO(lavelle): Still returns dummy data. Default WebDAV directory listing
  // call doesn't return the metadata of directory contents, so we need to
  // fetch it manually for each file.
  return {
    isDirectory: false,
    name: name,
    size: 0,
    modificationTime: new Date(0),
    mimeType: 'text/plain'
  };
};

/**
 * Constructs an object representing a directory for the file system provider.
 * @param {string} name The name of the directory.
 * @return {Object} A plain object representing a directory with the given name
 *     in the file system provider API.
 */
var makeDirectory = function(name) {
  return {
    isDirectory: true,
    name: name,
    size: 0,
    modificationTime: new Date(0)
  };
};

/**
 * Responds to a request for the contents of a directory.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the directory was
 *     read successfully.
 * @param {Function} onError Function to be called if an error occured while
 *     attempting to read the directory.
 */
var onReadDirectoryRequested = function(options, onSuccess, onError) {
  var path = options.directoryPath;

  webDAVFS.readDirectory({
    path: path,
    onSuccess: function(list) {
      onSuccess(list, false);
    },
    onError: function(error) {
      onError('FAILED');
    }
  });
};

/**
 * Responds to a request for the contents of a file.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the file was
 *     read successfully.
 * @param {Function} onError Function to be called if an error occured while
 *     attempting to read the file.
 */
var onReadFileRequested = function(options, onSuccess, onError) {
  var path = webDAVFS.openedFiles[options.openRequestId];

  if (!path) {
    onError('INVALID_OPERATION');
    return;
  }

  webDAVFS.readFile({
    path: path,
    onSuccess: function(data) {
      onSuccess(data, false);
    },
    onError: function(error) {
      onError('FAILED');
    }
  });
};

/**
 * Responds to a request to unmount the file system.
 * @param {Object} inputOptions Input options.
 * @param {Function} onSuccess Function to be called if the file system was
 *     unmounted successfully.
 * @param {Function} onError Function to be called if an error occured while
 *     attempting to umount the file system.
 */
var onUnmountRequested = function(inputOptions, onSuccess, onError) {
  var options = {
    fileSystemId: webDAVFS.options.fileSystemId
  };

  chrome.fileSystemProvider.unmount(options, onSuccess, onError);
};

module.exports = {
  onCloseFileRequested: onCloseFileRequested,
  onOpenFileRequested: onOpenFileRequested,
  onReadFileRequested: onReadFileRequested,
  onGetMetadataRequested: onGetMetadataRequested,
  onReadDirectoryRequested: onReadDirectoryRequested,
  onUnmountRequested: onUnmountRequested
};
