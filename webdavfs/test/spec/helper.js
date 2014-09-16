// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var WebDAVFS = require('../../js/wdfs');
var config = require('../../../testserver/config');

// Mock the parts of the Chrome API needed to test.
window.chrome = {
  fileSystemProvider: {
    unmount: function(options, onSuccess) {
      onSuccess(options);
    }
  },
  i18n: {
    getMessage: function(name) {
      return name;
    }
  }
};

// No need to try/catch here: If the URL is invalid the tests will abort and
// the error message will be displayed in the console, which is desired
// behaviour.
window.webDAVFS = new WebDAVFS(config.URL);

// Convenience method to convert ArrayBuffer responses to strings for more
// readable assertions.
window.arrayBufferToString = require('../../../shared/util').arrayBufferToString;

// Run initialisation code to prepare the environment for testing.
before(function(done){
  // Test the connection to the server by attempting to read a known file and
  // show an error message prompting the user to start the server if it doesn't
  // exist.
  webDAVFS.readFile({
    path: '/1.txt',
    range: {
      start: 0,
      end: 512
    },
    onSuccess: function() {
      done();
    },
    onError: function() {
      var message = 'Could not connect to server.\nPlease start it by ' +
        'typing `node server.js &` from the testserver directory.';
      throw new Error(message);
    }
  });
});

beforeEach(function(done) {
  webDAVFS.reset(done);
});
