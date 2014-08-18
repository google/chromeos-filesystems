// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/**
 * WebDAV server used to provide files for unit tests and manual testing of
 * the extension.
 * The skeleton directory that is served is located in `test/assets`.
 */

'use strict';

var jsdav = require('jsDAV/lib/jsdav');
var config = require('./config');

jsdav.createServer({node: __dirname + config.ASSETS_DIRECTORY}, config.PORT);
