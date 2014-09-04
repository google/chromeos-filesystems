// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

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

      onGetMetadataRequested(statOptions, function() {
        onDeleteEntryRequested(deleteOptions, function() {
          onGetMetadataRequested(statOptions, function() {
            throw new Error('Delete operation failed to remove file.');
          }, function(error) {
            error.should.be.a('string');
            error.should.equal('NOT_FOUND');
            done();
          });
        }, onError);
      }, onError);
    });
  });
};
