// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/**
 * Responds to a request for the contents of a file.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the file was
 *     read successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to read the file.
 */
module.exports = function(options, onSuccess, onError) {
  if (!(options.openRequestId in s3fs.openedFiles)) {
    onError('INVALID_OPERATION');
    return;
  }

  // Strip the leading slash, since not used internally.
  var path = s3fs.openedFiles[options.openRequestId].substring(1);

  // Calculate the index of the last byte to fetch. Subtract 1 because HTTP
  // byte ranges are inclusive.
  var end = options.offset + options.length - 1;

  var parameters = s3fs.parameters({
    Key: path,
    Range: 'bytes=' + options.offset + '-' + end
  });

  s3fs.s3.getObject(parameters, function(error, data) {
    if (error) {
      // TODO(lavelle): add logic for returning more specific error codes.
      onError('FAILED');
    } else {
      onSuccess(data.Body.toArrayBuffer(), false);
    }
  });
};
