// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use-strict';

var AWSValidator = function() {
  // List of valid AWS regions for S3. Taken from
  // http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region.
  this.regions = [
    'us-east-1', 'us-west-2', 'us-west-1', 'eu-west-1',
    'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'sa-east-1'
  ];
};

/**
 * Returns whether or not a given string is a valid AWS access key ID.
 * @param {string} key The key to validate.
 * @return {boolean} Whether or not the key is valid.
 */
AWSValidator.prototype.accessKey = function(key) {
  // Access key must be a string.
  if (typeof key !== 'string') { return false; }

  // Access keys must be 20 characters long.
  if (key.length !== 20) { return false; }

  // Access keys must start with the string 'AKIA'.
  if (key.substring(0, 4) !== 'AKIA') { return false; }

  // The remaining 16 characters must all be digits or uppercase letters.
  return /^[0-9A-Z]{16}$/.test(key.substring(4, 20));
};

/**
 * Returns whether or not a given string is a valid AWS secret key.
 * @param {string} key The key to validate.
 * @return {boolean} Whether or not the key is valid.
 */
AWSValidator.prototype.secretKey = function(key) {
  // Secret keys must be 40 characters long, and composed of upper and lower
  // case letters, digits, forward slashes and pluses.
  return /^([a-zA-Z0-9]|\/|\+){40}$/.test(key);
};

/**
 * Returns whether or not a given string is a valid AWS S3 region.
 * @param {string} region The region to validate.
 * @return {boolean} Whether or not the region is valid.
 */
AWSValidator.prototype.region = function(region) {
  return this.regions.indexOf(region) !== -1;
};

/**
 * Returns whether or not a given string is a valid AWS S3 bucket name.
 *
 * A bucket name is a string of 3-63 characters (inclusive), containing only
 * lowercase letters, digits, periods and hyphens. There must be no consecutive
 * periods, and the first character must be a lowercase letter or a digit.
 * See: http://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html
 *
 * @param {string} bucket The bucket name to validate.
 * @return {boolean} Whether or not the bucket name is valid.
 */
AWSValidator.prototype.bucketName = function(bucket) {
  // Disallow consecutive periods.
  if (/\.\./g.test(bucket)) { return false; }

  // Disallow periods at the end.
  if (bucket[bucket.length - 1] === '.') { return false; }

  // Check for everything else mentioned above.
  return /^[a-z0-9]{1}([a-z0-9]|\-|\.){2,62}$/.test(bucket);
};

module.exports = AWSValidator;
