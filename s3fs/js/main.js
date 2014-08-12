// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var S3FS = require('./s3fs');
var credentials = require('./credentials');

// Import all the functions to handle the various file system events.
var events = {
  onCloseFileRequested: require('./events/onCloseFileRequested'),
  onOpenFileRequested: require('./events/onOpenFileRequested'),
  onReadFileRequested: require('./events/onReadFileRequested'),
  onGetMetadataRequested: require('./events/onGetMetadataRequested'),
  onReadDirectoryRequested: require('./events/onReadDirectoryRequested')
};

window.onload = function() {
  var key = credentials.key;
  var secret = credentials.secret;
  var region = 'us-west-2';
  // TODO(lavelle): make this a parameter and connect to the bucket selection
  // UI.
  var bucket = 'chromeostest';

  window.s3fs = new S3FS(key, secret, region, bucket);

  // Register each of the event listeners to the FSP.
  for (var name in events) {
    chrome.fileSystemProvider[name].addListener(events[name]);
  }

  // Callback for when the file system has been successfully mounted.
  // Builds the file system index for use by the directory listing event later.
  var onSuccess = function() {};

  var onError = function(error) {
    console.error('Failed to mount the file system.');
    console.error(error);
  };

  // Mount the file system.
  chrome.fileSystemProvider.mount(s3fs.options, onSuccess, onError);
};
