// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/* jshint -W027 */

'use strict';

var onReadFileRequested = require('../../js/events/onReadFileRequested');
var onOpenFileRequested = require('../../js/events/onOpenFileRequested');

var arrayBufferToString = function(buffer) {
  var bufferView = new Uint8Array(buffer);
  var characterCodes = [];

  for (var i = 0; i < bufferView.length; i++) {
    characterCodes.push(bufferView[i]);
  }

  return String.fromCharCode.apply(null, characterCodes);
};

describe('onReadFileRequested', function() {
  it('should fail for files that have not been opened yet', function(done) {
    var options = {
      openRequestId: 1,
      filePath: '/hi.txt'
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
      filePath: '/hi.txt',
      mode: 'READ',
      create: false,
      requestId: 1
    };

    var expected = 'hello\n';

    var onOpenSuccess = function() {
      var options = {
        openRequestId: 1,
        offset: 0,
        length: 512
      };

      var onReadSuccess = function(contents, hasMore) {
        contents.should.be.an.instanceof(ArrayBuffer);

        contents.byteLength.should.equal(6);

        var string = arrayBufferToString(contents);
        string.substring(0, 6).should.equal(expected);

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

  it('should work for files larger than the chunk size of 512kb',
    function(done) {
      // Downloads a 4 megabyte text file filled with 1s.
      var options = {
        filePath: '/big.txt',
        mode: 'READ',
        create: false,
        requestId: 2
      };

      var onOpenSuccess = function() {
        var options = {
          openRequestId: 2,
          length: 512,
          offset: 0
        };

        var onReadSuccess = function(contents, hasMore) {
          contents.should.be.an.instanceof(ArrayBuffer);

          contents.byteLength.should.equal(512);

          var string = arrayBufferToString(contents);
          string[0].should.equal('1');
          string[string.length - 1].should.equal('1');

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
