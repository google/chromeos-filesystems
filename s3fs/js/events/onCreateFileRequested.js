// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/**
 * Responds to a request to create a new file.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the file was created
 *     successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to create the file.
 */
module.exports = function(options, onSuccess, onError) {
  // Strip the leading slash, since not used internally.
  var path = options.filePath.substring(1);

  var parameters = s3fs.parameters({
    Key: path,
    Body: new ArrayBuffer(),
    ContentLength: 0
  });

  // TODO(lavelle): handle the case where it already exists here.
  // Do nothing, or report an error?

  s3fs.s3.putObject(parameters, function(error, data) {
    if (error) {
      // TODO(lavelle): add logic for returning more specific error codes.
      onError('FAILED');
    } else {
      onSuccess();
    }
  });
};
