// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/* jshint -W027 */

'use strict';

var onOpenFileRequested = require('../../js/events/onOpenFileRequested');

describe('onOpenFileRequested', function() {
  it('should reject attempts to create files', function(done) {
    var options = {
      filePath: '/new.txt',
      mode: 'READ',
      create: true,
      requestId: 1
    };

    var onSuccess = function() {
      throw new Error('Should have rejected file open.');
      done();
    };

    var onError = function(error) {
      error.should.be.a('string');
      error.should.equal('INVALID_OPERATION');
      done();
    };

    onOpenFileRequested(options, onSuccess, onError);
  });

  it('should reject attempts to write files', function(done) {
    var options = {
      filePath: '/new.txt',
      mode: 'WRITE',
      create: false,
      requestId: 1
    };

    var onSuccess = function() {
      throw new Error('Should have rejected file open.');
      done();
    };

    var onError = function(error) {
      error.should.be.a('string');
      error.should.equal('INVALID_OPERATION');
      done();
    };

    onOpenFileRequested(options, onSuccess, onError);
  });

  it('should allow read-only opening of existing files', function(done) {
    var options = {
      filePath: '/hi.txt',
      mode: 'READ',
      create: false,
      requestId: 1
    };

    var onSuccess = function() {
      s3fs.openedFiles[options.requestId].should.equal(options.filePath);
      done();
    };

    var onError = function(error) {
      throw error;
      done();
    };

    onOpenFileRequested(options, onSuccess, onError);
  });
});
