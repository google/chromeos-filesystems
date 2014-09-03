// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require('../../../shared/util');

/**
 * Responds to a request to open a file.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the file was opened
 *      successfully.
 * @param {function} onError Function to be called if an error occured while
 *      attempting to open the file.
 */
var onOpenFileRequested = function(options, onSuccess, onError) {
  if (!util.isRequestValid(options)) {
    onError('INVALID_OPERATION');
  } else {
    if (options.create) {
      // TODO(lavelle): create file here.
    }

    s3fs.openedFiles[options.requestId] = options.filePath;
    onSuccess();
  }
};

module.exports = onOpenFileRequested;
