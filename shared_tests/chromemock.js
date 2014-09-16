// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

module.exports = function() {
  // Mocks the parts of the Chrome extension API needed to test the providers
  // in a regular webpage.
  window.chrome = {
    fileSystemProvider: {
      unmount: function(options, onSuccess) {
        onSuccess(options);
      }
    },
    i18n: {
      getMessage: function(name) {
        return name;
      }
    }
  };
};
