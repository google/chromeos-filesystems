// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// Event called on opening a file with the extension or mime type
// declared in the manifest file.
chrome.app.runtime.onLaunched.addListener(app.onLaunched);

// Event called on a profile startup.
chrome.runtime.onStartup.addListener(app.onStartup);

// Save the state before suspending the event page, so we can resume it
// once new events arrive.
chrome.runtime.onSuspend.addListener(app.onSuspend);

chrome.fileSystemProvider.onUnmountRequested.addListener(
    app.onUnmountRequested);
chrome.fileSystemProvider.onGetMetadataRequested.addListener(
    app.onGetMetadataRequested);
chrome.fileSystemProvider.onReadDirectoryRequested.addListener(
    app.onReadDirectoryRequested);
chrome.fileSystemProvider.onOpenFileRequested.addListener(
    app.onOpenFileRequested);
chrome.fileSystemProvider.onCloseFileRequested.addListener(
    app.onCloseFileRequested);
chrome.fileSystemProvider.onReadFileRequested.addListener(
    app.onReadFileRequested);

// For NaCl use 'newlib/[Release|Debug]/module.nmf' as configuration file path
// and 'application/x-nacl' as mime type.
// For PNaCl use 'pnacl/[Release|Debug]/module.nmf' as configuration file path
// and 'application/x-pnacl' as mime type.
document.addEventListener('DOMContentLoaded', function() {
  app.loadNaclModule('newlib/Debug/module.nmf', 'application/x-nacl');
});

