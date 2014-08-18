// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/* jshint -W027 */

var onGetMetadataRequested =
  require('../../js/events').onGetMetadataRequested;
var assert = require('assert');

describe('onGetMetadataRequested', function() {
  it('should return the correct metadata object for files', function(done) {
    var options = {
      entryPath: '/1.txt'
    };

    var onSuccess = function(metadata, hasMore) {
      metadata.should.have.property('isDirectory', false);
      metadata.should.have.property('name', '1.txt');
      metadata.should.have.property('size', 0);
      metadata.should.have.property('mimeType', 'text/plain; charset=utf-8');
      done();
    };

    var onError = function(error) {
      throw new Error(error);
    };

    onGetMetadataRequested(options, onSuccess, onError);
  });

  it('should return the correct metadata object for a non-root directory',
    function(done) {
      var options = {
        entryPath: '/dir1'
      };

      var onSuccess = function(metadata, hasMore) {
        metadata.should.have.property('size', 0);
        metadata.should.have.property('name', 'dir1');
        metadata.should.have.property('isDirectory', true);
        done();
      };

      var onError = function(error) {
        throw new Error(error);
      };

      onGetMetadataRequested(options, onSuccess, onError);
  });

  it('should return the correct metadata object for the root directory',
    function(done) {
      var options = {
        entryPath: '/'
      };

      var onSuccess = function(metadata, hasMore) {
        metadata.should.have.property('size', 0);
        metadata.should.have.property('name', '');
        metadata.should.have.property('isDirectory', true);
        done();
      };

      var onError = function(error) {
        throw new Error(error);
      };

      onGetMetadataRequested(options, onSuccess, onError);
  });
});
