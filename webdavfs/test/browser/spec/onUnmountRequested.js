// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/* jshint -W027 */

var onUnmountRequested = require('../../../js/events').onUnmountRequested;

describe('onUnmountRequested', function() {
  it('should return the file system ID after a successful unmount',
    function(done) {
      var options = {};

      var onSuccess = function(options) {
        options.should.have.property('fileSystemId', 'webdavfs');
        done();
      };

      var onError = function(error) {
        throw new Error(error);
      };

      onUnmountRequested(options, onSuccess, onError);
  });
});
