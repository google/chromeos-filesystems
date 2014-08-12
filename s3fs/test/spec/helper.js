// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/* jshint -W027 */

'use strict';

// Register a global S3 client used by all the tests.
var S3FS = require('../../js/s3fs');
var credentials = require('../../js/credentials');
var bindFix = require('../../../third_party/bindfix/bindfix');

var key = credentials.key;
var secret = credentials.secret;
var region = 'us-west-2';
var bucket = 'chromeostest';

window.s3fs = new S3FS(key, secret, region, bucket);

bindFix();

// Mock the parts of the Chrome API needed to test.
window.chrome = {
  fileSystemProvider: {
    unmount: function(options, onSuccess, onError) {
      onSuccess(options);
    }
  }
};
