// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var S3FS = require('./s3fs');

// Import all the functions to handle the various file system events.
var events = {
  onCloseFileRequested: require('./events/onCloseFileRequested'),
  onOpenFileRequested: require('./events/onOpenFileRequested'),
  onReadFileRequested: require('./events/onReadFileRequested'),
  onGetMetadataRequested: require('./events/onGetMetadataRequested'),
  onReadDirectoryRequested: require('./events/onReadDirectoryRequested')
};

var keys = ['bucket', 'region', 'access', 'secret'];

/**
 * Mounts an S3 bucket with the given name and region as a file system in the
 * file browser.
 *
 * @param {string} bucket The name of the bucket.
 * @param {string} region The AWS region of the bucket.
 * @param {string} access The AWS access key ID for the user who is accessing
 *     the bucket.
 * @param {string} secret The AWS secret key for the user who is accessing
 *     the bucket.
 * @param {Object=} callbacks
 *     @param {function} onSuccess The function to be called when the bucket is
 *         mounted successfully.
 *     @param {function} onError The function to be called if the bucket fails
 *         to mount.
 */
var mount = function(bucket, region, access, secret, opt_callbacks) {
  window.s3fs = new S3FS(bucket, region, access, secret);

  var callbacks = opt_callbacks || {};

  // Set a default error handler that logs the error for developer use.
  var onError = callbacks.onError || function(error) {
    console.error('Failed to mount the file system.');
    console.error(error);
  };

  var onSuccess = function() {
    // Register each of the event listeners to the FSP.
    for (var name in events) {
      chrome.fileSystemProvider[name].addListener(events[name]);
    }

    // Store the credentials so the bucket can be automatically remounted
    // after a Chrome relaunch.
    chrome.storage.sync.set({
      access: access,
      secret: secret,
      bucket: bucket,
      region: region
    });

    if (callbacks.onSuccess) {
      callbacks.onSuccess();
    }
  };

  // Mount the file system.
  chrome.fileSystemProvider.mount(s3fs.options, onSuccess, onError);
};

window.onload = function() {
  // Remount the instance when Chrome is relaunched. If there are credentials
  // saved, use them straight away to mount an instance.

  chrome.storage.sync.get(keys, function(items) {
    // If any of the 4 required values are missing, abort.
    for (var i = 0; i < keys.length; i++) {
      if (!items[keys[i]]) { return; }
    }

    // Mount the instance using saved credentials.
    mount({
      bucket: items.bucket,
      region: items.region,
      access: items.access,
      secret: items.secret
    });
  });
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

// Main function to handle requests from the settings UI.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'mount':
      // TODO(lavelle): at this point bucket and region are syntactically valid
      // strings for their repsective types, but may still cause errors.
      // Errors to test for this before mounting:
      //   - Bucket does not exist.
      //   - Wrong region for bucket.
      //   - Invalid credentials for bucket/access denied.

      // Mount the bucket with the given request data.
      mount({
        bucket: request.bucket,
        region: request.region,
        access: request.access,
        secret: request.secret,
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
