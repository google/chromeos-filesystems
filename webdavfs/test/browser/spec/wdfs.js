// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

/* jshint -W027 */

var config = require('../../../config');

describe('WebDAV Filesystem', function() {
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
