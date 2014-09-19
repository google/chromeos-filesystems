// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require('../../shared/util');

/**
 * Class that encapsulates metadata for the S3 filesystem and the bucket to
 * which it connects.
 * @class
 * @param {string} bucket The name of the S3 bucket to connect to.
 * @param {string} region The AWS region of the bucket eg. 'us-west-2'.
 * @param {string} access The AWS access key ID used to authenticate.
 * @param {string} secret The AWS secret access key used to authenticate.
 */
var S3FS = function(bucket, region, access, secret) {
  AWS.config.update({
    accessKeyId: access,
    secretAccessKey: secret
  });

  // AWS bucket region string.
  AWS.config.region = region;

  // AWS SDK client for communicating with the API.
  this.s3 = new AWS.S3();

  // Options for the file system provider API.
  this.options = {
    fileSystemId: 's3fs-' + bucket,
    displayName: 'Amazon S3 Bucket: ' + bucket
  };

  this.supportsRecursive = false;

  // Stores a record of all opened files.
  this.openedFiles = {};

  // Default parameters for calls to the AWS API.
  this.defaultParameters = {Bucket: bucket};
};

/**
 * Extends the default parameters with any additional ones needed for a
 * particular API call.
 * @param {Object=} opt_extras The extra parameters.
 * @return {Object} A new object with both the default parameters and the new
 *     ones.
 */
S3FS.prototype.parameters = function(opt_extras) {
  var extras = opt_extras || {};
  return util.extend({}, this.defaultParameters, extras);
};

module.exports = S3FS;
