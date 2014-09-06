// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require('../shared/util');

module.exports = function(onWriteFileRequested, onReadFileRequested,
  onOpenFileRequested) {
    describe('onWriteFileRequested', function() {
      it('should write the correct data to a new file', function(done) {
        var id = 987;

        var openOptions = {
          filePath: '/new_write.txt',
          mode: 'WRITE',
          create: true,
          requestId: id
        };

        var readOptions = {
          length: 512,
          offset: 0,
          openRequestId: id
        };

        var testString = 'TEST';

        var writeOptions = {
          openRequestId: id,
          data: util.stringToArrayBuffer(testString),
          offset: 0,
          length: 512
        };

        var onError = function(error) {
          throw new Error(error);
        };

        (new Promise(onOpenFileRequested.bind(null, openOptions)))
            .then(util.createPromise(onWriteFileRequested, writeOptions))
            .then(util.createPromise(onReadFileRequested, readOptions))
            .then(function(data) {
              util.arrayBufferToString(data).should.equal(testString);
              done();
            })
            .catch(onError);
      });
    });

    it('should overwrite the correct data to an exisiting file', function(done) {
      var id = 1024;

      var openOptions = {
        filePath: '/3.txt',
        mode: 'WRITE',
        create: false,
        requestId: id
      };

      var readOptions = {
        length: 512,
        offset: 0,
        openRequestId: id
      };

      var testString = 'OVERWRITTEN';

      var writeOptions = {
        openRequestId: id,
        data: util.stringToArrayBuffer(testString),
        offset: 0,
        length: 512
      };

      var onError = function(error) {
        throw new Error(error);
      };

      (new Promise(onOpenFileRequested.bind(null, openOptions)))
          .then(util.createPromise(onWriteFileRequested, writeOptions))
          .then(util.createPromise(onReadFileRequested, readOptions))
          .then(function(data) {
            util.arrayBufferToString(data).should.equal(testString);
            done();
          })
          .catch(onError);
    });
};
