// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require ('../util');

/**
 * Responds to a request for the contents of a directory.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the directory was
 *     read successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to read the directory.
 */
module.exports = function(options, onSuccess, onError) {
  // Remove the leading slash from the file path - not used in S3 bucket keys.
  var path = options.directoryPath.substring(1);

  var parameters = s3fs.parameters({
    Prefix: path,
    Delimiter: '/'
  });

  s3fs.s3.listObjects(parameters, function(error, data) {
    if (error) {
      // TODO(lavelle): add logic to return more specific error codes.
      onError('FAILED');
      return;
    }

    var files = data.Contents.map(function(item) {
      // Content type is omitted from the results as it is not present in the
      // S3 API response.
      return {
        isDirectory: false,
        name: item.Key,
        size: item.Size,
        modificationTime: item.LastModified,
      };
    });

    var directories = data.CommonPrefixes.map(function(item) {
      var name = item.Prefix.substring(0, item.Prefix.length - 1);

      return util.makeDirectory(name);
    });

    var list = directories.concat(files);

    // Return it to the API.
    onSuccess(list, false);
  });
};
