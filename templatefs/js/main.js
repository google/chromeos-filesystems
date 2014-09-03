// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

// Import all the functions to handle the various file system events.
var events = {
  onCloseFileRequested: require('./events/onCloseFileRequested'),
  onOpenFileRequested: require('./events/onOpenFileRequested'),
  onReadFileRequested: require('./events/onReadFileRequested'),
  onGetMetadataRequested: require('./events/onGetMetadataRequested'),
  onReadDirectoryRequested: require('./events/onReadDirectoryRequested')
};


// Main function to handle requests from the settings UI.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'mount':
      // Mount your instance here using the data from the UI.

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
