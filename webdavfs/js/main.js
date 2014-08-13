// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var WebDAVFS = require('./wdfs');

// Import all the functions to handle the various file system events.
var events = require('./events');

chrome.runtime.onInstalled.addListener(function() {
  window.webDAVFS = new WebDAVFS('http://localhost:8000');

  // Register each of the event listeners to the file system provider.
  for (var name in events) {
    chrome.fileSystemProvider[name].addListener(events[name]);
  }

  // Callback for when the file system has been successfully mounted.
  var onSuccess = function() { };

  var onError = function() {
    console.error('Failed to mount.');
  };

  // Mount the file system.
  chrome.fileSystemProvider.mount(webDAVFS.options, onSuccess, onError);
});

chrome.app.runtime.onLaunched.addListener(function(launchData) {
  console.log('launched');

  var windowOptions = {
    outerBounds: {
      left: 10,
      top: 10,
      width: 800,
      height: 700
    }
  };

  chrome.app.window.create('build.html', windowOptions);
});
