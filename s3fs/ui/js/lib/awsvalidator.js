// Copyright 2014 The Chromium Authors. All rights reserved.

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
 * Current access key format is exactly 20 uppercase alphanumeric characters.
 * See: http://blogs.aws.amazon.com/security/post/Tx1XG3FX6VMU6O5/A-safer-way-to-distribute-AWS-credentials-to-EC2
 *
 * @param {string} key The key to validate.
 * @return {boolean} Whether or not the key is valid.
 */
AWSValidator.prototype.accessKey = function(key) {
  return /^[0-9A-Z]{20}$/.test(key);
};

/**
 * Returns whether or not a given string is a valid AWS secret key.
 * Current format is exactly 40 base-64 characters (upper and lower case
 * letters, digits, slashes, pluses and equals).
 * See: http://blogs.aws.amazon.com/security/post/Tx1XG3FX6VMU6O5/A-safer-way-to-distribute-AWS-credentials-to-EC2
 *
 * @param {string} key The key to validate.
 * @return {boolean} Whether or not the key is valid.
 */
AWSValidator.prototype.secretKey = function(key) {
  return /^([a-zA-Z0-9]|\/|\+|\=){40}$/.test(key);
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
