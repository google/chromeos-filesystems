// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/**
 * Responds to a request to move an entry.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the entry was copied
 *     successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to copy the entry.
 */
module.exports = function(options, onSuccess, onError) {
  // Strip the leading slash, since not used internally.
  var targetPath = options.targetPath.substring(1);

  var copySource = encodeURIComponent(s3fs.defaultParameters.Bucket +
    options.sourcePath);

  // The AWS SDK has no moveObject method, so we emulate it with a copy from A
  // to B followed by a delete of A.

  var copyParameters = s3fs.parameters({
    Key: targetPath,
    CopySource: copySource
  });

  var deleteParameters = s3fs.parameters({
    Key: options.sourcePath.substring(1)
  });

  // TODO(lavelle): handle the recursive/directory case.

  s3fs.s3.copyObject(copyParameters, function(error) {
    if (error) {
      // TODO(lavelle): add logic for returning more specific error codes.
      onError('FAILED');
    } else {
      s3fs.s3.deleteObject(deleteParameters, function(error) {
        if (error) {
          onError('FAILED');
        }
        onSuccess();
      });
    }
  });
};
