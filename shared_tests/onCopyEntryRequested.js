// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

module.exports = function(onCopyEntryRequested, onGetMetadataRequested) {
  describe('onCopyEntryRequested', function() {
    it('should be able to copy files to locations that do not yet exist', function(done) {
      var source = 'dir2/2.txt';
      var target = '2_copied.txt';

      var statOptions = {
        entryPath: '/' + target
      };

      var copyOptions = {
        sourcePath: '/' + source,
        targetPath: '/' + target
      };

      var onError = function(error) {
        throw new Error(error);
      };

      var postCopySuccess = function(data) {
        data.name.should.equal(target);
        done();
      };

      onGetMetadataRequested(statOptions, function() {
        throw new Error('File should not exist before copying.');
      }, function() {
        onCopyEntryRequested(copyOptions, function() {
          onGetMetadataRequested(statOptions, postCopySuccess, onError);
        }, onError);
      });
    });

    it('should be able to copy directories to locations that do not yet exist', function(done) {
      var source = 'dir2';
      var target = 'dir2_copied';

      var statOptions = {
        entryPath: '/' + target
      };

      var copyOptions = {
        sourcePath: '/' + source,
        targetPath: '/' + target
      };

      var onError = function(error) {
        throw new Error(error);
      };

      var postCopySuccess = function(data) {
        data.name.should.equal(target);
        done();
      };

      onGetMetadataRequested(statOptions, function() {
        throw new Error('Directory should not exist before copying.');
      }, function() {
        onCopyEntryRequested(copyOptions, function() {
          onGetMetadataRequested(statOptions, postCopySuccess, onError);
        }, onError);
      });
    });

    it('should be not overwrite existing files/directories', function(done) {
      var source = 'dir2';
      var target = 'dir1';

      var statOptions = {
        entryPath: '/' + target
      };

      var copyOptions = {
        sourcePath: '/' + source,
        targetPath: '/' + target
      };

      onGetMetadataRequested(statOptions, function() {
        onCopyEntryRequested(copyOptions, function() {
          throw new Error('Should have rejected copy to existing location');
        }, function(error) {
          error.should.be.a('string');
          error.should.equal('EXISTS');
          done();
        });
      }, function() {
        throw new Error('Target should exist before copying.');
      });
    });
  });
};
