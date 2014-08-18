// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/* jshint -W027 */

var onReadFileRequested = require('../../js/events').onReadFileRequested;
var onOpenFileRequested = require('../../js/events').onOpenFileRequested;

describe('onReadFileRequested', function() {
  it('should fail for files that have not been opened yet', function(done) {
    var options = {
      openRequestId: 1,
      filePath: '/1.txt'
    };

    var onSuccess = function(contents, hasMore) {
      throw new Error('Should have rejected file read.');
      done();
    };

    var onError = function(error) {
      error.should.be.a('string');
      error.should.equal('INVALID_OPERATION');
      done();
    };

    onReadFileRequested(options, onSuccess, onError);
  });

  it('should return the correct contents for an opened file', function(done) {
    var options = {
      filePath: '/1.txt',
      mode: 'READ',
      create: false,
      requestId: 1
    };

    var expected = '1';

    var onOpenSuccess = function() {
      var options = {
        openRequestId: 1
      };

      var onReadSuccess = function(contents, hasMore) {
        contents.should.be.an.instanceof(ArrayBuffer);

        contents.byteLength.should.equal(1);

        var string = arrayBufferToString(contents);
        string.should.equal(expected);

        done();
      };

      var onReadError = function(error) {
        throw new Error(error);
      };

      onReadFileRequested(options, onReadSuccess, onReadError);
    };

    var onOpenError = function(error) {
      throw new Error(error);
    };

    onOpenFileRequested(options, onOpenSuccess, onOpenError);
  });
});
