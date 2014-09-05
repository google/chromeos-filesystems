// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

module.exports = function(onCopyEntryRequested, onGetMetadataRequested) {
  describe('onCopyEntryRequested', function() {
    it('should ', function(done) {
      var source = '1.txt';
      var target = '1_copied.txt';

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
        data.name.should.equal(filename);
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
  });
};
