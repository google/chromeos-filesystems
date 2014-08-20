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

/**
 * Mounts an S3 bucket with the given name and region as a file system in the
 * file browser.
 *
 * @param {Object} options
 *     @param {string} bucket The name of the bucket.
 *     @param {string} region The AWS region of the bucket.
 *     @param {string} key The AWS access key ID for the user who is accessing
 *         the bucket.
 *     @param {string} secret The AWS secret key for the user who is accessing
 *         the bucket.
 *     @param {function} onSuccess The function to be called when the bucket is
 *         mounted successfully.
 *     @param {function} onError The function to be called if the bucket fails
 *         to mount;
 */
var mount = function(options) {
  if (!options) {
    console.error('No options provided for the mount function.');
    return;
  }

  var required = ['key', 'secret', 'bucket', 'region'];

  for (var i = 0; i < required.length; i++) {
    var option = required[i];

    if (!options[option]) {
      // If these options are not present the internal API is not being used
      // correctly, so log it to the console as a developer error rather than
      // displaying the message to the user.
      console.error('Missing argument for mount: ' + option + '.');
      return;
    }
  }

  window.s3fs = new S3FS(options.key, options.secret, options.region,
    options.bucket);

  // Set a default error handler that logs the error for developer use.
  var onError = options.onError || function(error) {
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
      accessKey: options.key,
      secretKey: options.secret,
      bucket: options.bucket,
      region: options.region
    });

    if (options.onSuccess) {
      options.onSuccess();
    }
  };

  // Mount the file system.
  chrome.fileSystemProvider.mount(s3fs.options, onSuccess, onError);
};

window.onload = function() {
  // Remount the instance when Chrome is relaunched. If there are credentials
  // saved, use them straight away to mount an instance.

  var keys = ['bucket', 'region', 'accessKey', 'secretKey'];

  chrome.storage.sync.get(keys, function(items) {
    // If any of the 4 required values are missing, abort.
    for (var i = 0; i < keys.length; i++) {
      if (!items[keys[i]]) { return; }
    }

    // Mount the instance using saved credentials.
    mount({
      bucket: items.bucket,
      region: items.region,
      key: items.accessKey,
      secret: items.secretKey
    });
  });
};


chrome.app.runtime.onLaunched.addListener(function() {
  // Open the settings UI when the user clicks on the app icon in the Chrome
  // app launcher.

  var windowOptions = {
    outerBounds: {
      left: 10,
      top: 10,
      minWidth: 800,
      minHeight: 700
    }
  };

  chrome.app.window.create('auth.html', windowOptions);
});

// Main function to handle requests from the settings UI.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Enforce the presence of a request type
  if (!request.type) {
    sendResponse({
      type: 'error',
      success: false,
      message: 'No request type provided.'
    });

    return;
  }

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
        key: request.key,
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
      sendResponse({
        type: 'error',
        success: false,
        message: 'Invalid request type: ' + request.type
      });
      break;
  }

  // Return true from the event listener to indicate that we will be sending
  // the response asynchronously, so that the sendResponse function is still
  // valid at the time it's used.
  return true;
});
