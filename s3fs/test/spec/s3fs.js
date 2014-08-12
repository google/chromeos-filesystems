// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/* jshint -W027 */

'use strict';

describe('S3FS', function() {
  it('should have an AWS client', function() {
    s3fs.s3.should.be.an.instanceof(AWS.S3);
  });

  it('should have the correct display name', function() {
    s3fs.options.displayName.should.equal('Amazon S3 Bucket: chromeostest');
  });

  it('should have the correct ID', function() {
    s3fs.options.fileSystemId.should.equal('s3fs-chromeostest');
  });

  it('should store an index of currently open files', function() {
    s3fs.openedFiles.should.be.an('object');
  });

  it('should have a set of default parameters for calls to the API',
    function() {
      s3fs.defaultParameters.should.be.an('object');
  });

  it('should have the correct bucket name', function() {
    s3fs.defaultParameters.Bucket.should.equal('chromeostest');
  });

  describe('params', function() {
    it('should extend the default parameters with new ones', function() {
      s3fs.parameters({a: 1, b: 2}).should.deep.equal({
        Bucket: 'chromeostest',
        a: 1,
        b: 2
      });
    });
  });
});
