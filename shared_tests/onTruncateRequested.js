// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require('../shared/util');

var testFactory = function(open, read, truncate) {
  return function(file, id, length, expected) {
    return function(done) {
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
        length: length
      };

      var onError = function(error) {
        throw new Error(error);
      };

      open(openOptions, function() {
        read(readOptions, function(data) {
          var before = util.arrayBufferToString(data);
          before.should.have.length(expected.before.length);
          before.should.equal(expected.before);

          truncate(truncateOptions, function() {
            read(readOptions, function(data) {
              var after = util.arrayBufferToString(data);
              after.should.have.length(expected.after.length);
              after.should.equal(expected.after);

              done();
            }, onError);
          }, onError);
        }, onError);
      }, onError);
    };
  };
};

module.exports = function(onTruncateRequested, onReadFileRequested,
  onOpenFileRequested) {
    describe('onTruncateRequested', function() {
      var testTruncate = testFactory(onOpenFileRequested,
        onReadFileRequested, onTruncateRequested);

      it('should truncate the contents of a file to the correct length',
        testTruncate('/truncatable.txt', 999, 10, {
          before: 'abcdefghijklmnopqrstuvwxyz',
          after: 'abcdefghij'
        }));

      it('should truncate the contents of a file to length zero correctly',
        testTruncate('/2.txt', 998, 0, {
          before: '2',
          after: ''
        }));

      it('should pad a file with null bytes when truncating with a length ' +
        'longer than that of the original file',
        testTruncate('/11.txt', 997, 10, {
          before: '11',
          after: '11\0\0\0\0\0\0\0\0'
        }));
    });
};
