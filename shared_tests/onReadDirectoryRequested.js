// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

module.exports = function(onReadDirectoryRequested) {
  describe('onReadDirectoryRequested', function() {
    it('should return the correct contents for the given directory',
      function(done) {
        var options = {
          directoryPath: '/'
        };

        var onSuccess = function(list, hasMore) {
          list.should.have.length(12);

          var directory = list.filter(function(entry) {
            return entry.name === 'dir1';
          })[0];
          directory.should.exist;
          directory.should.have.property('isDirectory', true);
          directory.should.have.property('name', 'dir1');
          directory.should.have.property('size', 0);
          directory.should.have.property('modificationTime')
            .that.is.an.instanceof(Date);
          directory.should.not.have.property('mimeType');

          var file = list.filter(function(entry) {
            return entry.name === '1.txt';
          })[0];
          file.should.have.property('isDirectory', false);
          file.should.have.property('name', '1.txt');

          // MIME type is optional, but if present should still be valid.
          if (file.mimeType) {
            file.mimeType.should.match(/^text\/plain/);
          }

          file.should.have.property('size', 1);
          file.should.have.property('modificationTime')
            .that.is.an.instanceof(Date);

          done();
        };

        var onError = function(error) {
          throw new Error(error);
        };

        onReadDirectoryRequested(options, onSuccess, onError);
    });
  });
};
