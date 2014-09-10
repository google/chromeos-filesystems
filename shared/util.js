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

/**
 * Extends a destination object with the properties of one or more source
 * objects.
 * @param {Object} destination The destination object.
 * @param {...Object} var_sources One or more source objects.
 * @return {Object} The original destination object, with all the additional
 *     properties from the source objects.
 */
var extend = function(destination, var_sources) {
  var sources = Array.prototype.slice.call(arguments, 1);

  sources.forEach(function(source) {
    if (!source) { return; }

    for (var property in source) {
      destination[property] = source[property];
    }
  });

  return destination;
};

/**
 * Creates a metadata object representing a directory.
 * @param {string} name The name of the directory.
 * @return {Object} A plain object representing a directory with the given name
 *     in the file system provider API.
 */
var makeDirectory = function(name) {
  return {
    isDirectory: true,
    name: name,
    size: 0,
    modificationTime: new Date(0),
  };
};

module.exports = {
  arrayBufferToString: arrayBufferToString,
  stringToArrayBuffer: stringToArrayBuffer,
  blobToArrayBuffer: blobToArrayBuffer,
  isRequestValid: isRequestValid,
  extend: extend,
  makeDirectory: makeDirectory
};
