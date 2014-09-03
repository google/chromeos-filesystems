// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var arrayBufferToString = function(buffer) {
  return new TextDecoder('utf-8').decode(new DataView(buffer));
};

var stringToArrayBuffer = function(string) {
  return new TextEncoder('utf-8').encode(string).buffer;
}

module.exports = {
  arrayBufferToString: arrayBufferToString
};
