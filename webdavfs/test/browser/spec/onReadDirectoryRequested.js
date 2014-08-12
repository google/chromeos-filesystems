// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/* jshint -W027 */

var onReadDirectoryRequested =
  require('../../../js/events').onReadDirectoryRequested;

describe('onReadDirectoryRequested', function() {
  it('should return the correct contents for the given directory',
    function(done) {
      var options = {
        directoryPath: '/'
      };

      var onSuccess = function(list, hasMore) {
        list.should.have.length(10);
        list[0].should.have.property('isDirectory').that.is.a('boolean');
        list[0].should.have.property('name').that.is.a('string');
        list[0].should.have.property('size').that.is.a('number');
        list[0].should.have.property('modificationTime')
          .that.is.an.instanceof(Date);
        done();
      };

      var onError = function(error) {
        throw new Error(error);
      };

      onReadDirectoryRequested(options, onSuccess, onError);
  });
});
