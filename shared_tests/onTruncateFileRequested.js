// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require('../shared/util');

module.exports = function(onTruncateFileRequested, onReadFileRequested,
  onOpenFileRequested) {
    describe('onTruncateFileRequested', function() {
      it('should truncate the contents of a file to the correct length',
        function(done) {
          var id = 999;
          var file = '/truncatable.txt';

          var openOptions = {
            filePath: file,
            mode: 'WRITE',
            create: false,
            requestId: id
          };

          var readOptions = {
            length: 512,
            offset: 0,
            openRequestId: id
          };

          var truncateOptions = {
            filePath: file,
            length: 10
          };

          var onError = function(error) {
            throw new Error(error);
          };

          onOpenFileRequested(openOptions, function() {
            onReadFileRequested(readOptions, function(data) {
              var before = util.arrayBufferToString(data);
              before.should.have.length(26);
              before.should.equal('abcdefghijklmnopqrstuvwxyz');

              onTruncateFileRequested(truncateOptions, function() {
                onReadFileRequested(readOptions, function(data) {
                  var after = util.arrayBufferToString(data);
                  after.should.have.length(10);
                  after.should.equal('abcdefghij');

                  done();
                }, onError);
              }, onError);
            }, onError);
          }, onError);
      });
    });

    describe('onTruncateFileRequested', function() {
      it('should truncate the contents of a file to length zero correctly',
        function(done) {
          var id = 998;
          var file = '/2.txt';

          var openOptions = {
            filePath: file,
            mode: 'WRITE',
            create: false,
            requestId: id
          };

          var readOptions = {
            length: 512,
            offset: 0,
            openRequestId: id
          };

          var truncateOptions = {
            filePath: file,
            length: 0
          };

          var onError = function(error) {
            throw new Error(error);
          };

          onOpenFileRequested(openOptions, function() {
            onReadFileRequested(readOptions, function(data) {
              var before = util.arrayBufferToString(data);
              before.should.have.length(1);
              before.should.equal('2');

              onTruncateFileRequested(truncateOptions, function() {
                onReadFileRequested(readOptions, function(data) {
                  var after = util.arrayBufferToString(data);
                  after.should.have.length(0);
                  after.should.equal('');

                  done();
                }, onError);
              }, onError);
            }, onError);
          }, onError);
      });
    });

    describe('onTruncateFileRequested', function() {
      it('should pad a file with null bytes when truncating with a length ' +
        'longer than that of the original file', function(done) {
          var id = 997;
          var file = '/11.txt';

          var openOptions = {
            filePath: file,
            mode: 'WRITE',
            create: false,
            requestId: id
          };

          var readOptions = {
            length: 512,
            offset: 0,
            openRequestId: id
          };

          var truncateOptions = {
            filePath: file,
            length: 10
          };

          var onError = function(error) {
            throw new Error(error);
          };

          onOpenFileRequested(openOptions, function() {
            onReadFileRequested(readOptions, function(data) {
              var before = util.arrayBufferToString(data);
              before.should.have.length(2);
              before.should.equal('11');

              onTruncateFileRequested(truncateOptions, function() {
                onReadFileRequested(readOptions, function(data) {
                  var after = util.arrayBufferToString(data);
                  after.should.have.length(10);
                  after.should.equal('11\0\0\0\0\0\0\0\0');

                  done();
                }, onError);
              }, onError);
            }, onError);
          }, onError);
      });
    });
};
