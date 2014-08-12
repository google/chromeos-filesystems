// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var onReadDirectoryRequested =
  require('../../js/events/onReadDirectoryRequested');

describe('onReadDirectoryRequested', function() {
  it('should return the correct contents for the given directory',
    function(done) {
      var options = {
        directoryPath: '/'
      };

      var onSuccess = function(list, hasMore) {
        list.should.have.length(3);

        var directory = list[0];
        directory.should.have.property('isDirectory', true);
        directory.should.have.property('name', 'foo');
        directory.should.have.property('size', 0);
        directory.should.have.property('modificationTime')
          .that.is.an.instanceof(Date);

        var file = list[2];
        file.should.have.property('isDirectory', false);
        file.should.have.property('name', 'hi.txt');
        file.should.have.property('mimeType', 'text/plain');
        file.should.have.property('size', 6);
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
