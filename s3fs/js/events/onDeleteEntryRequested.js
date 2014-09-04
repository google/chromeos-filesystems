// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/**
 * Responds to a request to delete a file or directory.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the entry was deleted
 *     successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to delete the entry.
 */
module.exports = function(options, onSuccess, onError) {
  // Strip the leading slash, since not used internally.
  var path = options.entryPath.substring(1);

  var parameters = s3fs.parameters({
    Key: path,
  });

  // TOOD(lavelle): handle the directory/recursive case here.

  s3fs.s3.deleteObject(parameters, function(error, data) {
    if (error) {
      // TODO(lavelle): add logic for returning more specific error codes.
      onError('FAILED');
    } else {
      onSuccess();
    }
  });
};
