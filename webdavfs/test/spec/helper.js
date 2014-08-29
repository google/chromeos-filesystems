// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var WebDAVFS = require('../../js/wdfs');
var config = require('../../../testserver/config');
window.webDAVFS = new WebDAVFS(config.URL);

// Convenience method to convert ArrayBuffer responses to strings for more
// readable assertions.
window.arrayBufferToString = function(buffer) {
  return new TextDecoder('utf-8').decode(new DataView(buffer));
};

// Mock the parts of the Chrome API needed to test.
window.chrome = {
  fileSystemProvider: {
    unmount: function(options, onSuccess) {
      onSuccess(options);
    }
  }
};

// Run initialisation code to prepare the environment for testing.
before(function(){
  // Test the connection to the server by attempting to read a known file and
  // show an error message prompting the user to start the server if it doesn't
  // exist.
  webDAVFS.readFile({
    path: '/1.txt',
    range: {
      start: 0,
      end: 512
    },
    onSuccess: function() { },
    onError: function() {
      var message = 'Could not connect to server.\nPlease start it by ' +
        'typing `node server.js &` from the testserver directory.';
      throw new Error(message);
    }
  });
});
