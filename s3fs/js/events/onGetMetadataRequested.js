// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require('../util');

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
  // Remove the leading slash from the path -- this isn't used in S3 keys.
  var path = options.entryPath.substring(1);

  var metadata;
  // Handle the special case for the root directory.
  if (path === '') {
    metadata = util.makeDirectory('/');
    onSuccess(metadata, false);
    return;
  }

  // First check if the path corresponds to a valid directory by seeing if
  // there are any objects in the bucket with the path as a prefix.
  var parameters = s3fs.parameters({
    Prefix: path + '/',
    Delimiter: '/'
  });

  s3fs.s3.listObjects(parameters, function(error, data) {
    if (data && data.Contents.length > 0) {
      metadata = util.makeDirectory(path);
      onSuccess(metadata, false);
      return;
    }

    // If it isn't a directory, it might still be a file, so send another
    // request to fetch the metadata for that.
    parameters = s3fs.parameters({Key: path});

    s3fs.s3.getObject(parameters, function(error, data) {
      // If there's still an error, it's not a file or a directory, so call
      // the error callback.
      if (error) {
        onError('NOT_FOUND');
        return;
      }

      // If there's no error, it's a file, so convert the metadata into the
      // right format and return it to the API.
      metadata = {
        isDirectory: false,
        name: path,
        size: data.Body.length,
        modificationTime: new Date(data.LastModified),
        mimeType: data.ContentType
      };

      onSuccess(metadata, false);
    });
  });
};
