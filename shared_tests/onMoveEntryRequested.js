// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

module.exports = function(onMoveEntryRequested, onGetMetadataRequested) {
  describe('onMoveEntryRequested', function() {
    it('should be able to move a file ', function(done) {
      var source = 'dir11/11.txt';
      var target = '11_moved.txt';

      var statSource = {
        entryPath: '/' + source
      };

      var statTarget = {
        entryPath: '/' + target
      };

      var copyOptions = {
        sourcePath: '/' + source,
        targetPath: '/' + target
      };

      var onError = function(error) {
        throw new Error(error);
      };

      var postMoveSuccess = function(data) {
        data.name.should.equal(target);
        done();
      };

      onGetMetadataRequested(statTarget, function() {
        throw new Error('File should not be at target location before moving.');
      }, function() {
        onMoveEntryRequested(copyOptions, function() {
          onGetMetadataRequested(statTarget, function(data) {
            onGetMetadataRequested(statSource, function() {
              throw new Error('File should not be at source location after ' +
                'moving.');
            }, function() {
              postMoveSuccess(data);
            })
          }, function() {
            throw new Error('File should be at target location after moving.');
          });
        }, onError);
      });
    });
  });
};
