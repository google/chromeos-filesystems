// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var WebDAVFS = require('../../js/wdfs');
var config = require('../../../testserver/config');

var chromemock = require('../../../shared_tests/chromemock');
chromemock();

var makeClient = function() {
  // No need to try/catch here: If the URL is invalid the tests will abort and
  // the error message will be displayed in the console, which is desired
  // behaviour.
  window.webDAVFS = new WebDAVFS(config.URL);
};

makeClient();

// Convenience method to convert ArrayBuffer responses to strings for more
// readable assertions.
window.arrayBufferToString = require('../../../shared/util').arrayBufferToString;

// Run initialisation code to prepare the environment for testing.
before(function(done){
  webDAVFS.checkConnection(done);
});

beforeEach(function(done) {
  makeClient();
  webDAVFS.reset(done);
});
