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
 * See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
 */
var AWS = {};

AWS.config = {
  // Credentials aren't needed by the mock so this is a noop.
  update: function() {}
};

/**
 * Dummy class to mock the interface of the S3 response body object.
 * @constructs
 * @param ArrayBuffer buffer An ArrayBuffer holding the contents of the file.
 */
var ResponseBody = function(buffer) {
  this.buffer = buffer;
  this.length = buffer.byteLength;
};

/**
 * @return ArrayBuffer The stored buffer.
 */
ResponseBody.prototype.toArrayBuffer = function() {
  return this.buffer;
};

/**
 * Class for S3-specific methods within the AWS namespace.
 */
var S3 = function() {};

/**
 * Implements the S3 listObjects method in terms of WebDAVFS's readDirectory.
 * See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
 *
 * @param Object parameters The S3 API parameters for this function.
 * @param function callback The callback to be executed when the operation
 *     finishes.
 */
S3.prototype.listObjects = function(parameters, callback) {
  var path = '/' + parameters.Prefix;

  wdfs.readDirectory({
    path: path,
    onSuccess: function(response) {
      var error = null;

      var CommonPrefixes = [];
      var Contents = [];

      response.map(function(item) {
        if (item.isDirectory) {
          CommonPrefixes.push({
            Prefix: item.name + '/'
          });
        } else {
          Contents.push({
            Key: item.name,
            Size: item.size,
            LastModified: item.modificationTime
          });
        }
      });

      var data = {
        CommonPrefixes: CommonPrefixes,
        Contents: Contents
      };
      callback(error, data);
    },
    onError: function(error) {
      var data = null;
      callback(error, data);
    }
  });
};

/**
 * Implements the S3 getObject method in terms of WebDAVFS's readFile.
 * See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
 *
 * @param Object parameters The S3 API parameters for this function.
 * @param function callback The callback to be executed when the operation
 *     finishes.
 */
S3.prototype.getObject = function(parameters, callback) {
  var path =  '/' + parameters.Key;

  wdfs.readFile({
    path: path,
    onSuccess: function(buffer) {
      var error = null;

      if (parameters.Range) {
        var range = parameters.Range.replace('bytes=', '').split('-');
        var start = parseInt(range[0], 10);
        var end = parseInt(range[1], 10) + 1;
        buffer = buffer.slice(start, end);
      }

      var data = {
        LastModified: new Date(),
        Body: new ResponseBody(buffer),
        ContentType: 'text/plain'
      };

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
