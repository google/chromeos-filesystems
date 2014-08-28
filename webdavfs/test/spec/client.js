// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/* jshint -W027 */

describe('WebDAV Client', function() {
  // Unit tests for methods that operate on directories only.
  describe('Directory methods', function() {
    describe('children', function() {
      it('should list the contents of the directory', function(done) {
        webDAVFS.readDirectory({
          path: '/',
          onSuccess: function(list) {
            list.should.have.length.above(0);
            list[0].should.have.property('name').that.is.a('string');
            list[0].should.have.property('modificationTime')
              .that.is.an.instanceof(Date);
            list[0].should.have.property('size').that.is.a('number');
            list[0].should.have.property('isDirectory').that.is.a('boolean');

            done();
          },
          onError: function(error) {
            throw new Error(error);
            done();
          }
        });
      });
    });
  });

  // Unit tests for methods that operate on files and directories.
  describe('Entry methods', function() {
    describe('metadata', function() {
      it('should return a metadata object for the file in the correct format',
        function(done) {
          webDAVFS.getMetadata({
            path: '/1.txt',
            onSuccess: function(metadata) {
              metadata.should.have.property('name').that.is.a('string');
              metadata.should.have.property('modificationTime')
                .that.is.an.instanceof(Date);
              metadata.should.have.property('size').that.is.a('number');
              metadata.should.have.property('isDirectory').that.is.a('boolean');

              done();
            },
            onError: function(error) {
              throw new Error(error);
              done();
            }
          });
      });
    });
  });

  // Unit tests for methods that operate on files only.
  describe('File methods', function(){
    describe('read', function() {
      it('should return the contents of the file', function(done) {
        webDAVFS.readFile({
          path: '/1.txt',
          range: {
            start: 0,
            end: 512
          },
          onSuccess: function(contents) {
            arrayBufferToString(contents).should.equal('1');
            done();
          },
          onError: function(error) {
            throw new Error(error);
            done();
          }
        });
      });
    });
  });
});
