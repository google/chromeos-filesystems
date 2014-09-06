// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require('../shared/util');

module.exports = function(onCreateFileRequested, onGetMetadataRequested) {
  describe('onCreateFileRequested', function() {
    it('should create a new file', function(done) {
      var filename = 'new_create.txt';

      var statOptions = {
        entryPath: '/' + filename
      };

      var createOptions = {
        filePath: '/' + filename,
      };

      var onError = function(error) {
        throw new Error(error);
      };

      var postCreateSuccess = function(data) {
        data.name.should.equal(filename);
        done();
      };

      (new Promise(onGetMetadataRequested.bind(null, statOptions)))
          .then(function() {
            throw new Error('File should not exist before creating.');
          })
          .catch(util.createPromise(onCreateFileRequested, createOptions))
          .then(util.createPromise(onGetMetadataRequested, statOptions))
          .then(postCreateSuccess)
          .catch(onError);
    });
  });
};
