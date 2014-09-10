// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/**
 * WebDAV error code map.
 * All taken from http://msdn.microsoft.com/en-us/library/aa142917(v=exchg.65).aspx
 * @const
 * @type {Object}
 */
var ERROR_MAP = {
  '201': 'OK',
  '204': 'OK',
  '403': 'INVALID_OPERATION',
  '404': 'NOT_FOUND',
  '409': 'FAILED',
  '412': 'EXISTS',
  '423': 'IN_USE',
  '502': 'ACCESS_DENIED',
  '507': 'NO_SPACE'
};

/**
 * Converts a HTTP error code into its equivalent code for the FSP API.
 * @param {number} code The HTTP error code.
 * @return {string} The FSP error code.
 */
var getError = function(code) {
  code = '' + code;
  if (code in ERROR_MAP) {
    return ERROR_MAP[code];
  } else {
    return 'FAILED';
  }
};

module.exports = getError;
