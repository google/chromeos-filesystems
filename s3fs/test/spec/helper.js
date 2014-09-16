// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/* jshint -W027 */

'use strict';

var S3FS = require('../../js/s3fs');
// Mock the S3 API.
window.AWS = require('./s3mock');

var chromemock = require('../../../shared_tests/chromemock');
chromemock();

// Convenience method to convert ArrayBuffer responses to strings for more
// readable assertions.
window.arrayBufferToString = require('../../../shared/util').arrayBufferToString;

var access = 'fake-key';
var secret = 'fake-secret';
var region = 'us-west-2';
var bucket = 'chromeostest';

var makeClient = function() {
  window.s3fs = new S3FS(bucket, region, access, secret);
};

makeClient();

before(function(done){
  s3fs.s3.wdfs.checkConnection(done);
});

beforeEach(function(done) {
  makeClient();
  s3fs.s3.wdfs.reset(done);
});
