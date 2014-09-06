// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require('../shared/util');

module.exports = function(onTruncateFileRequested, onReadFileRequested,
  onOpenFileRequested) {
    describe('onTruncateFileRequested', function() {
      it('should truncate the contents of a file to the correct length', function(done) {
        var id = 999;
        var file = '/big.txt';

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
          onTruncateFileRequested(truncateOptions, function() {
            onReadFileRequested(readOptions, function(data) {
              util.arrayBufferToString(data).should.equal('1111111111');
              done();
            }, onError);
          }, onError);
        }, onError);
      });
    });
};
