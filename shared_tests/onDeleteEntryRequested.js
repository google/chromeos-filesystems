// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require('../shared/util');

module.exports = function(onDeleteEntryRequested, onGetMetadataRequested) {
  describe('onDeleteEntryRequested', function() {
    it('should remove an existing file', function(done) {
      var statOptions = {
        entryPath: '/1.txt'
      };

      var deleteOptions = {
        entryPath: '/1.txt',
        recursive: false
      };

      var onError = function(error) {
        throw new Error(error);
      };

      var postDeleteSuccess = function() {
        throw new Error('Delete operation failed to remove file.');
      };

      var postDeleteError = function(error) {
        error.should.be.a('string');
        error.should.equal('NOT_FOUND');
        done();
      };

      (new Promise(onGetMetadataRequested.bind(null, statOptions)))
          .then(util.createPromise(onDeleteEntryRequested, deleteOptions))
          .catch(onError)
          .then(util.createPromise(onGetMetadataRequested, statOptions))
          .then(postDeleteSuccess, postDeleteError)
    });
  });
};
