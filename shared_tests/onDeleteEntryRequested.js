// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

module.exports = function(fs, onDeleteEntryRequested, onGetMetadataRequested) {
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

    it('should remove an empty directory without needing the recursive flag',
      function(done) {
        var statOptions = {
          entryPath: '/empty'
        };

        var deleteOptions = {
          entryPath: '/empty',
          recursive: false
        };

        var onError = function(error) {
          throw new Error(error);
        };

        var postDeleteSuccess = function() {
          throw new Error('Delete operation failed to remove empty directory.');
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

    it('should remove a non-empty directory with the recursive flag',
      function(done) {
        var statOptions = {
          entryPath: '/dir1'
        };

        var deleteOptions = {
          entryPath: '/dir1',
          recursive: true
        };

        var onError = function(error) {
          throw new Error(error);
        };

        var postDeleteSuccess = function(metadata) {
          console.log(metadata);
          throw new Error('Delete operation failed to remove directory.');
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

    it('should refuse to remove a non-empty directory without the recursive flag',
      function(done) {
        var deleteOptions = {
          entryPath: '/dir1',
          recursive: false
        };

        onDeleteEntryRequested(deleteOptions, function() {
          throw new Error('Should have rejected an attempt to delete a ' +
            'non-empty directory without the recursive flag set.');
        }, function(error) {
          error.should.be.a('string');
          error.should.equal('NOT_EMPTY');
          done();
        });
    });
  });
};
