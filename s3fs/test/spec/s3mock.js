// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var async = require('async');

var WebDAVFS = require('../../../webdavfs/js/wdfs');
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
 * @param {ArrayBuffer} buffer An ArrayBuffer holding the contents of the file.
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
var S3 = function() {
  this.wdfs = new WebDAVFS('http://localhost:8000');
};

/**
 * Implements the S3 listObjects method in terms of WebDAVFS's readDirectory.
 * See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
 *
 * @param {Object} parameters The S3 API parameters for this function.
 * @param {function} callback The callback to be executed when the operation
 *     finishes.
 */
S3.prototype.listObjects = function(parameters, callback) {
  var path = '/' + parameters.Prefix;

  if (parameters.Delimiter !== '/') {
    var message = 'Missing or invalid delimiter for listObjects call. ' +
      'Always use \'/\'.';
    callback(message, null);
    return;
  }

  this.wdfs.readDirectory({
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
 * @param {Object} parameters The S3 API parameters for this function.
 * @param {function} callback The callback to be executed when the operation
 *     finishes.
 */
S3.prototype.getObject = function(parameters, callback) {
  var path =  '/' + parameters.Key;

  var args = {
    path: path,
    onSuccess: function(buffer) {
      var error = null;

      var data = {
        LastModified: new Date(),
        Body: new ResponseBody(buffer),
        ContentType: 'text/plain; charset=utf-8'
      };

      callback(error, data);
    },
    onError: function(error) {
      var data = null;
      callback(error, data);
    }
  };

  if (parameters.Range) {
    args.range = {};
    var parts = parameters.Range.replace('bytes=', '').split('-');

    args.range.start = parseInt(parts[0], 10);

    var end = parts[1];
    if (end.length > 0) {
      args.range.end = parseInt(end, 10) + 1;
    }
  }

  this.wdfs.readFile(args);
};

/**
 * Implements the S3 headObject method in terms of WebDAVFS's getMetadata.
 * See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#headObject-property
 *
 * @param {Object} parameters The S3 API parameters for this function.
 * @param {function} callback The callback to be executed when the operation
 *     finishes.
 */
S3.prototype.headObject = function(parameters, callback) {
  var path =  '/' + parameters.Key;

  this.wdfs.getMetadata({
    path: path,
    onSuccess: function(response) {
      var error = null;

      var data = {
        ContentLength: response.size,
        ContentType: response.mimeType,
        LastModified: response.modificationTime.toString()
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
 * Implements the S3 putObject method in terms of WebDAVFS's writeFile.
 * See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
 *
 * @param {Object} parameters The S3 API parameters for this function.
 * @param {function} callback The callback to be executed when the operation
 *     finishes.
 */
S3.prototype.putObject = function(parameters, callback) {
  this.wdfs.writeFile({
    path: '/' + parameters.Key,
    data: parameters.Body,
    onSuccess: function() {
      callback(null, {});
    },
    onError: function(error) {
      callback(error, null);
    }
  });
};

/**
 * Implements the S3 deleteObject method in terms of WebDAVFS's deleteEntry.
 * See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
 *
 * @param {Object} parameters The S3 API parameters for this function.
 * @param {function} callback The callback to be executed when the operation
 *     finishes.
 */
S3.prototype.deleteObject = function(parameters, callback) {
  this.wdfs.deleteEntry({
    path: '/' + parameters.Key,
    onSuccess: function() {
      callback(null, {});
    },
    onError: function(error) {
      callback(error, null);
    }
  });
};

/**
 * Implements the S3 copyObject method in terms of WebDAVFS's copyEntry.
 * See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#copyObject-property
 *
 * @param {Object} parameters The S3 API parameters for this function.
 * @param {function} callback The callback to be executed when the operation
 *     finishes.
 */
S3.prototype.copyObject = function(parameters, callback) {
  this.wdfs.copyEntry({
    sourcePath: '/' + decodeURIComponent(parameters.CopySource).split('/').pop(),
    targetPath: '/' + parameters.Key,
    onSuccess: function() {
      callback(null, {});
    },
    onError: function(error) {
      callback(error, null);
    }
  });
};

/**
 * Implements the S3 deleteObjects method in terms of WebDAVFS's deleteEntry.
 * See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property
 *
 * @param {Object} parameters The S3 API parameters for this function.
 * @param {function} callback The callback to be executed when the operation
 *     finishes.
 */
S3.prototype.deleteObjects = function(parameters, callback) {
  var wdfs = this.wdfs;

  async.eachSeries(parameters.Delete, function(item, eachCallback) {
    console.log(item.Key);

    wdfs.deleteEntry({
      path: item.Key.substring(1),
      onSuccess: eachCallback,
      onError: eachCallback
    });
  }, function(error) {
    if (error) {
      callback(error, null);
    }
    else {
      callback(null, {});
    }
  });
};

AWS.S3 = S3;

module.exports = AWS;
