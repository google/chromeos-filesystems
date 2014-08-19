// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var WebDAVFS = require('../../../webdavfs/js/wdfs');
var wdfs = new WebDAVFS('http://localhost:8000');

/**
 * Mocks the parts of the official AWS JavaScript SDK that are used by the S3
 * filesystem for testing without needing to connect to a real S3 bucket.
 * Connects to the test WebDAV server used by the WebDAV FS test suite and
 * converts the responses to the S3 API format.
 * See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/frames.html
 */
var AWS = {};

AWS.config = {
  // Credentials aren't needed by the mock so this is a noop.
  update: function() {};
};

/**
 * S3-specific methods within the AWS namespace.
 */
var S3 = function() {};

/**
 * S3-specific methods within the AWS namespace.
 */
S3.prototype.listObjects = function(parameters, callback) {
  wdfs.readDirectory({
    path: '/' + parameters.Prefix,
    onSuccess: function(data) {
      var error = null;
      callback(error, data);
    },
    onError: function(error) {
      var data = null;
      callback(error, data);
    }
  });
};

S3.prototype.getObject = function(parameters, callback) {
  wdfs.readFile({
    path: '/' + parameters.Key,
    onSuccess: function(data) {
      var error = null;
      callback(error, data);
    },
    onError: function(error) {
      var data = null;
      callback(error, data);
    }
  });
};

AWS.S3 = S3;

module.exports = AWS;
