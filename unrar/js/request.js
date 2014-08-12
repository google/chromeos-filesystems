// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/**
 * Defines the protocol used to communicate between JS and NaCL.
 * This should be consistent with cpp/request.h.
 */
var request = {
  /**
   * Defines request ids. Every key should be unique and the same as the keys
   * on the NaCL side.
   * @enum {string}
   */
  Key: {
    // Mandatory keys for all requests.
    OPERATION: 'operation',
    FILE_SYSTEM_ID: 'file_system_id',
    REQUEST_ID: 'request_id',

    // Optional keys depending on request operation.
    ERROR: 'error',
    METADATA: 'metadata'
  },

  /**
   * Defines request operations. These operation should be the same as the
   * operations on the NaCL side.
   * @enum {number}
   */
  Operation: {
    READ_METADATA: 0,
    READ_METADATA_DONE: 1,
    FILE_SYSTEM_ERROR: -1  // Errors specific to a file system. Requires
                           // FILE_SYSTEM_ID and MESSAGE_ID.
  },

  /**
   * Creates a basic request with mandatory fields.
   * @param {request.Operation} operation The operation of the request.
   * @param {string} fileSystemId The file system id.
   * @param {number} requestId The request id. Should be unique only per file
   *     system.
   * @private
   * @return {Object} A new request with mandatory fields.
   */
  createBasic_: function(operation, fileSystemId, requestId) {
    var basicRequest = {};
    basicRequest[request.Key.OPERATION] = operation;
    basicRequest[request.Key.FILE_SYSTEM_ID] = fileSystemId;
    basicRequest[request.Key.REQUEST_ID] =
        requestId + '';  // Convert to string.
    return basicRequest;
  },

  /**
   * Creates a read metadata request.
   * @param {string} fileSystemId The file system id.
   * @param {number} requestId The request id.
   * @return {Object} A read metadata request.
   */
  createReadMetadataRequest: function(fileSystemId, requestId) {
    return request.createBasic_(request.Operation.READ_METADATA, fileSystemId,
                                requestId);
  }
};
