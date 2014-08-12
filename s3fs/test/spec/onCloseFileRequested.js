// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/* jshint -W027 */

'use strict';

var onCloseFileRequested = require('../../js/events/onCloseFileRequested');

describe('onCloseFileRequested', function() {
  it('should reject attempts to close unopened files', function(done) {
    var options = {
      openRequestId: 123
    };

    var onSuccess = function() {
      throw new Error('Should have rejected attempt to close unopened file.');
      done();
    };

    var onError = function(error) {
      error.should.be.a('string');
      error.should.equal('INVALID_OPERATION');
      done();
    };

    onCloseFileRequested(options, onSuccess, onError);
  });

  it('should close previously opened files', function(done) {
    var options = {
      openRequestId: 1
    };

    var onSuccess = function() {
      s3fs.openedFiles.should.not.have.property(options.openRequestId);
      done();
    };

    var onError = function(error) {
      throw error;
      done();
    };

    onCloseFileRequested(options, onSuccess, onError);
  });
});
