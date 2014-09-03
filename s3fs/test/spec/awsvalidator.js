// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/* jshint -W030 */

'use strict';

var AWSValidator = require('../../ui/awsvalidator');

var validator = new AWSValidator();

describe('AWSValidator', function() {
  describe('access', function() {
    it('should fail for strings shorter than 20 characters', function() {
      validator.access('FOO').should.be.false;
    });

    it('should fail for strings longer than 20 characters', function() {
      validator.access('ABCDEFGHIJKLMNOPQRSTUVWXYZ').should.be.false;
    });

    it('should fail for strings of 20 characters with the wrong start', function() {
      validator.access('BAD-ABCDEFGHIJKLMNOP').should.be.false;
    });

    it('should fail for strings of 20 characters with the right start but other invalid characters', function() {
      validator.access('AKIABCDEFGHIJK+M!O#').should.be.false;
    });

    it('should succeed for strings of 20 characters with the right start and all other characters valid', function() {
      validator.access('AKIABCDEFGHIJKLM1234').should.be.true;
    });
  });

  describe('secret', function() {
    it('should fail for strings shorter than 40 characters', function() {
      validator.secret('FOO').should.be.false;
    });

    it('should fail for strings longer than 40 characters', function() {
      var long52 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ';
      validator.secret(long52).should.be.false;
    });

    it('should fail for strings of 40 characters with invalid characters', function() {
      validator.secret('ABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHI#').should.be.false;
    });

    it('should succeed for strings of 40 characters with valid characters', function() {
       validator.secret('ABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJ').should.be.true;
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

  describe('bucket', function() {
    it('should reject bucket names shorter than 3 characters', function() {
      validator.bucket('hi').should.be.false;
    });

    it('should reject bucket names longer than 63 characters', function() {
      validator.bucket('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').should.be.false;
    });

    it('should reject bucket names that do not start with a letter or digit', function() {
      validator.bucket('.hi').should.be.false;
      validator.bucket('-hi').should.be.false;
    });

    it('should reject bucket names with two or more consecutive periods', function() {
      validator.bucket('foo..foo').should.be.false;
    });

    it('should reject bucket names that end with a period', function() {
      validator.bucket('foo.').should.be.false;
    });

    it('should accept valid bucket names', function() {
      validator.bucket('mybucket').should.be.true;
      validator.bucket('cool-bucket').should.be.true;
      validator.bucket('foo.bucket').should.be.true;
      validator.bucket('foo').should.be.true;
      validator.bucket('a-pretty-long-bucket-but-still-shorter-than-63-chars').should.be.true;
    });

    it('should reject IP addresses', function() {
      var ip = validator.regexes.ip;

      '127.0.0.1'.should.match(ip);
      '192.168.0.1'.should.match(ip);
      '8.8.8.8'.should.match(ip);
      '255.255.255.255'.should.match(ip);
      '999.999.999.999'.should.not.match(ip);
      'abc.def.hij.klm'.should.not.match(ip);
      'abc.1.1.1'.should.not.match(ip);
    });
  });
});
