// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/* jshint -W030 */

'use strict';

var AWSValidator = require('../../ui/js/lib/awsvalidator');

var validator = new AWSValidator();

describe('AWSValidator', function() {
  describe('accessKey', function() {
    it('should fail for strings shorter than 20 characters', function() {
      validator.accessKey('FOO').should.be.false;
    });

    it('should fail for strings longer than 20 characters', function() {
      validator.accessKey('ABCDEFGHIJKLMNOPQRSTUVWXYZ').should.be.false;
    });

    it('should fail for strings of 20 characters with the wrong start', function() {
      validator.accessKey('BAD-ABCDEFGHIJKLMNOP').should.be.false;
    });

    it('should fail for strings of 20 characters with the right start but other invalid characters', function() {
      validator.accessKey('AKIABCDEFGHIJK+M!O#').should.be.false;
    });

    it('should succeed for strings of 20 characters with the right start and all other characters valid', function() {
      validator.accessKey('AKIABCDEFGHIJKLM1234').should.be.true;
    });
  });

  describe('secretKey', function() {
    it('should fail for strings shorter than 40 characters', function() {
      validator.secretKey('FOO').should.be.false;
    });

    it('should fail for strings longer than 40 characters', function() {
      var long52 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ';
      validator.secretKey(long52).should.be.false;
    });

    it('should fail for strings of 40 characters with invalid characters', function() {
      validator.secretKey('ABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHI#').should.be.false;
    });

    it('should succeed for strings of 40 characters with valid characters', function() {
       validator.secretKey('ABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJ').should.be.true;
    });
  });

  describe('region', function() {
    it('should reject invalid regions', function() {
      validator.region(undefined).should.be.false;
      validator.region(null).should.be.false;
      validator.region(1).should.be.false;
      validator.region('foo').should.be.false;
      validator.region('reallyreallyreallylong').should.be.false;
      validator.region('us-west-932').should.be.false;
    });

    it('should accept valid regions', function() {
      validator.region('us-west-1').should.be.true;
      validator.region('ap-southeast-2').should.be.true;
    });
  });

  describe('bucketName', function() {
    it('should reject bucket names shorter than 3 characters', function() {
      validator.bucketName('hi').should.be.false;
    });

    it('should reject bucket names longer than 63 characters', function() {
      validator.bucketName('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').should.be.false;
    });

    it('should reject bucket names that do not start with a letter or digit', function() {
      validator.bucketName('.hi').should.be.false;
      validator.bucketName('-hi').should.be.false;
    });

    it('should reject bucket names with two or more consecutive periods', function() {
      validator.bucketName('foo..foo').should.be.false;
    });

    it('should reject bucket names that end with a period', function() {
      validator.bucketName('foo.').should.be.false;
    });

    it('should accept valid bucket names', function() {
      validator.bucketName('mybucket').should.be.true;
      validator.bucketName('cool-bucket').should.be.true;
      validator.bucketName('foo.bucket').should.be.true;
      validator.bucketName('foo').should.be.true;
      validator.bucketName('a-pretty-long-bucket-but-still-shorter-than-63-chars').should.be.true;
    });
  });
});
