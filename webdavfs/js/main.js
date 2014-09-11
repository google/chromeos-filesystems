// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var WebDAVFS = require('./wdfs');

// Import all the functions to handle the various file system events.
var events = require('./events');

/**
 * Mounts a new instance of the WebDAV provider that connects to the server at
 * the given URL.
 * @param {string} url The URL of the server to connect to.
 * @param {function=} callbacks.onSuccess Function to call if the server was
 *     mounted successfully.
 * @param {function=} callbacks.onError Function to call if an error occured
 *     while attempting to mount the server.
 */
var mount = function(url, callbacks) {
  var onSuccess = callbacks.onSuccess || function() { };

  var onError = callbacks.onError || function() {
    console.error('Failed to mount.');
  };

  try {
    window.webDAVFS = new WebDAVFS(url);
  } catch(error) {
    onError(error.message);
    return;
  }

  // Register each of the event listeners to the file system provider.
  for (var name in events) {
    chrome.fileSystemProvider[name].addListener(events[name]);
  }

  // Mount the file system.
  chrome.fileSystemProvider.mount(webDAVFS.options, onSuccess, onError);
};

chrome.app.runtime.onLaunched.addListener(function() {
  // Open the settings UI when the user clicks on the app icon in the Chrome
  // app launcher.

  var windowOptions = {
    outerBounds: {
      minWidth: 800,
      minHeight: 700
    }
  };

  chrome.app.window.create('build.html', windowOptions);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'mount':
      // Mount the new instance with the given request data.
      mount(request.url, {
        onSuccess: function() {
          sendResponse({
            type: 'mount',
            success: true
          });
        },
        onError: function(error) {
          sendResponse({
            type: 'mount',
            success: false,
            error: error
          });
        }
      });
      break;
    default:
      var message;
      if (request.type) {
        message = 'Invalid request type: ' + request.type + '.';
      } else {
        message = 'No request type provided.';
      }

      sendResponse({
        type: 'error',
        success: false,
        message: message
      });
      break;
  }

  // Return true from the event listener to indicate that we will be sending
  // the response asynchronously, so that the sendResponse function is still
  // valid at the time it's used.
  return true;
});
