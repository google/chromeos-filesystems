// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/**
 * Fetches the metadata associated with the file at the given path from the
 * WebDAV server.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the metadata was
 *     fetched successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to fetch the metadata.
 */
module.exports = function(options, onSuccess, onError) {
  if (!s3fs.openedFiles[options.openRequestId]) {
    onError('INVALID_OPERATION');
  } else {
    delete s3fs.openedFiles[options.openRequestId];
    onSuccess();
  }
};
