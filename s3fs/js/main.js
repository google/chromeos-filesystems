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

  // Register each of the event listeners to the FSP.
  for (var name in events) {
    chrome.fileSystemProvider[name].addListener(events[name]);
  }

  var onError = options.onError || function(error) {
    console.error('Failed to mount the file system.');
    console.error(error);
  };

  var onSuccess = function() {
    s3fs.s3.headBucket(s3fs.parameters(), function(error, data) {
      if (error) {
        console.error(error);
        options.onError(error);
        return;
      }

      if (options.onSuccess) {
        options.onSuccess();
      }
    });
  };

  // Mount the file system.
  chrome.fileSystemProvider.mount(s3fs.options, onSuccess, onError);
};

// Open the settings UI when the user clicks on the app icon in the Chrome
// app launcher.
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  console.log('launched');

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
      message: 'No request type provided.'
    });

    return;
  }

  switch (request.type) {
    case 'mount':
      // TODO(lavelle): this is technically a 'remount'. We want to unmount
      // the previously mounted bucket here and then mount a new one with the
      // new name/region.

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
      console.error('Invalid message type: ' + request.type);
      break;
  }
});
