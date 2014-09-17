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

      var postDeleteSuccess = function() {
        throw new Error('Delete operation failed to remove file.');
      };

      var postDeleteError = function(error) {
        error.should.be.a('string');
        error.should.equal('NOT_FOUND');
        done();
      };

      onGetMetadataRequested(statOptions, function() {
        onDeleteEntryRequested(deleteOptions, function() {
          onGetMetadataRequested(statOptions, postDeleteSuccess,
            postDeleteError);
        }, onError);
      }, onError);
    });

    it('should refuse to remove a directory without the recursive flag',
      function(done) {
        var deleteOptions = {
          entryPath: 'dir1',
          recursive: false
        };

        onDeleteEntryRequested(deleteOptions, function() {
          throw new Error('Should have rejected directory delete without ' +
            'the recursive flag set.');
        }, function(error) {
          error.should.be.a('string');
          // TODO(lavelle): this doesn't seem right, but it's what the WebDAV
          // server returns. Maybe should be NOT_A_FILE instead? Don't know
          // how to handle this case without more info from the server.
          error.should.equal('NOT_FOUND');
          done();
        });
    });
  });
};
