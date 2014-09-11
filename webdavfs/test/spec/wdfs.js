// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/* jshint -W027 */
var config = require('../../../testserver/config');
var WebDAVFS = require('../../js/wdfs');

describe('WebDAV Filesystem', function() {
  it('should throw an error with an invalid URL', function() {
    var construct = function() { new WebDAVFS(''); };
    construct.should.throw('Invalid host URL: string must not be empty.');
  });

  it('should have the correct ID', function() {
    webDAVFS.options.fileSystemId.should.equal('webdavfs');
  });

  it('should have the correct display name', function() {
    webDAVFS.options.displayName.should.equal('WebDAV');
  });

  it('should store the url passed to it', function() {
    webDAVFS.url.should.equal(config.URL);
  });
});
