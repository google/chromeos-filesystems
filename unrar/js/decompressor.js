// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/**
 * A class that takes care of communication between NaCl and archive volume.
 * Its job is to handle communication with the naclModule.
 * @constructor
 * @param {Object} naclModule The nacl module with which the decompressor
 *     communicates.
 * @param {string} fileSystemId The file system id of the correspondent volume.
 */
var Decompressor = function(naclModule, fileSystemId) {
  /**
   * The NaCl module that will decompress archives.
   * @type {Object}
   * @private
   */
  this.naclModule_ = naclModule;

  /**
   * @type {string}
   * @private
   */
  this.fileSystemId_ = fileSystemId;

  /**
   * Requests in progress. No need to save them onSuspend for now as metadata
   * reads are restarted from start.
   * @type {Object.<number, Object>}
   */
  this.requestsInProgress = {};
};

/**
 * Template for requests in progress. Some requests might require extra
 * information, but the callbacks onSuccess and onError are mandatory.
 * @private
 * @param {number} requestId The request id, which should be unique per every
 *     volume.
 * @param {function} onSuccess Callback to execute on success.
 * @param {function} onError Callback to execute on error.
 * @return {Object} An object with data about the request in progress.
 */
Decompressor.prototype.newRequest_ = function(requestId, onSuccess, onError) {
  console.assert(!this.requestsInProgress[requestId],
                 'There is already a request with the id ' + requestId + '.');

  this.requestsInProgress[requestId] = {
    onSuccess: onSuccess,
    onError: onError
  };
  return this.requestsInProgress[requestId];
};

/**
 * Creates a request for reading metadata.
 * @param {number} requestId The request id, which should be unique per every
 *     volume.
 * @param {function(Object.<string, Object>)} onSuccess Callback to execute once
 *     the metadata is obtained from NaCl. It has one parameter, which is the
 *     metadata itself. The metadata has as key the full path to an entry and as
 *     value information about the entry.
 * @param {function} onError Callback to execute in case of any error.
 */
Decompressor.prototype.readMetadata = function(requestId, onSuccess, onError) {
  this.newRequest_(requestId, onSuccess, onError);
  this.naclModule_.postMessage(request.createReadMetadataRequest(
      this.fileSystemId_, requestId));
};

/**
 * Processes messages from NaCl module.
 * @param {Object} data The data contained in the message from NaCl. Its
 *     types depend on the operation of the request.
 * @param {request.Operation} operation An operation from request.js.
 * @param {number} requestId The request id, which should be unique per every
 *     volume.
 */
Decompressor.prototype.processMessage = function(data, operation, requestId) {
  // Create a request reference for asynchronous calls as sometimes we delete
  // some requestsInProgress from this.requestsInProgress.
  var requestInProgress = this.requestsInProgress[requestId];
  console.assert(requestInProgress, 'No request for: ' + requestId + '.');

  switch (operation) {
    case request.Operation.READ_METADATA_DONE:
      var metadata = data[request.Key.METADATA];
      console.assert(metadata, 'No metadata.');
      requestInProgress.onSuccess(metadata);
      break;

    case request.Operation.FILE_SYSTEM_ERROR:
      console.error('File system error for <' + this.fileSystemId_ +
                    '>: ' + data[request.Key.ERROR] + '.');
      requestInProgress.onError('FAILED');
      break;

    default:
      console.error('Invalid NaCl operation: ' + operation + '.');
      requestInProgress.onError('FAILED');
  }
  delete this.requestsInProgress[requestId];
};
