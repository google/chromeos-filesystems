// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/* jshint -W027 */

'use strict';

var onGetMetadataRequested = require('../../js/events/onGetMetadataRequested');

describe('onGetMetadataRequested', function() {
  it('should return the correct metadata object for files', function(done) {
    var options = {
      entryPath: '/hi.txt'
    };

    var onSuccess = function(metadata, hasMore) {
      metadata.should.have.property('isDirectory', false);
      metadata.should.have.property('name', 'hi.txt');
      metadata.should.have.property('size', 6);
      metadata.should.have.property('mimeType', 'text/plain');
      metadata.should.have.property('modificationTime')
        .that.is.an.instanceof(Date);
      done();
    };

    var onError = function(error) {
      throw new Error(error);
    };

    onGetMetadataRequested(options, onSuccess, onError);
  });

  it('should return the correct metadata object for directories',
    function(done) {
      var options = {
        entryPath: '/'
      };

      var onSuccess = function(metadata, hasMore) {
        metadata.should.have.property('isDirectory', true);
        metadata.should.have.property('name', '/');
        metadata.should.have.property('size', 0);
        metadata.should.have.property('modificationTime')
          .that.is.an.instanceof(Date);
        done();
      };

      var onError = function(error) {
        throw new Error(error);
      };

      onGetMetadataRequested(options, onSuccess, onError);
  });
});
