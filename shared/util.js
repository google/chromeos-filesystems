// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/**
 * Callback that an ArrayBuffer read asynchronously from some source.
 *
 * @callback readCallback
 * @param {ArrayBuffer} buffer
 */

/**
 * Converts an ArrayBuffer of bytes representing characters in UTF-8 encoding
 * into the equivalent string.
 *
 * @param {ArrayBuffer} buffer The buffer to convert.
 * @return {string} The string representation.
 */
var arrayBufferToString = function(buffer) {
  return new TextDecoder('utf-8').decode(new DataView(buffer));
};

/**
 * Converts a string into an ArrayBuffer of bytes representing the characters
 * in UTF-8 encoding.
 *
 * @param {string} string The string to convert.
 * @return {ArrayBuffer} The ArrayBuffer representation of the string.
 */
var stringToArrayBuffer = function(string) {
  return new TextEncoder('utf-8').encode(string).buffer;
};

/**
 * Asynchronously reads the contents of a Blob into an ArrayBuffer.
 *
 * @param {Blob} blob The Blob to convert.
 * @param {readCallback} callback The function to be called with the resulting
 *     ArrayBuffer when the reading process has completed.
 */
var blobToArrayBuffer = function(blob, callback) {
  var reader = new FileReader();
  reader.addEventListener('loadend', function() {
    callback(reader.result);
  });
  reader.readAsArrayBuffer(blob);
};

/**
 * Returns true if an options object for opening a file is valid.
 * See: https://developer.chrome.com/apps/fileSystemProvider#event-onOpenFileRequested
 *
 * @param {Object} options The options object to validate.
 * @return {Boolean} Whether or not the options object is valid.
 */
var isRequestValid = function(options) {
  var validModes = ['READ', 'WRITE'];

  if (validModes.indexOf(options.mode) === -1) { return false; }

  // TODO(lavelle): More validation here eg.
  //   - Is it valid to open a file with mode = 'READ' and create = true?
  //   - Are 'READ' and 'WRITE' the only two valid modes?

  return true;
};

var createPromise = function(func, param) {
  return function() { return new Promise(func.bind(null, param)); }
}

module.exports = {
  arrayBufferToString: arrayBufferToString,
  stringToArrayBuffer: stringToArrayBuffer,
  blobToArrayBuffer: blobToArrayBuffer,
  isRequestValid: isRequestValid,
  createPromise: createPromise
};
