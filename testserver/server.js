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
var server = require("jsDAV/lib/DAV/server");
var util = require("jsDAV/lib/shared/util");
var plugin = require("jsDAV/lib/DAV/plugin");
var mockfs = require('mock-fs');
var config = require('./config');

var argv = process.argv.slice(2);

var flags = ['--debug', '-d'];

// Enable debug mode if the command-line flag is set.
if (argv.length > 0 && flags.indexOf(argv[0]) !== -1) {
  jsdav.debugMode = true;
}

// Define an object representing the contents of the mock filesystem to be
// used by the tests.
var structure = {};
structure[config.ASSETS_DIRECTORY] = {
  dir1: {
    '1.txt': '1',
  },
  dir11: {
    '11.txt': '11'
  },
  dir2: {
    '2.txt': '2'
  },
  nonemptydir: {
    '4.txt': '4'
  },
  walk: {
    dir1: {
      '1.txt': '1'
    },
    dir2: {
      '2.txt': '2'
    },
    '1.txt': '1'
  },
  empty: {},
  '1.txt': '1',
  '11.txt': '11',
  '2.txt': '2',
  '3.txt': '3',
  'big.txt': new Array(10001).join('1'),
  'truncatable.txt': 'abcdefghijklmnopqrstuvwxyz'
};

// Create a custom JSDAV plugin that mocks the filesystem with the contents
// defined above before every request so that each test has access to the same
// state.
var rebuilder = plugin.extend({
  name: 'rebuilder',
  initialize: function(handler) {
    handler.addEventListener('beforeMethod', function(event, method, file) {
      if (method === 'GET' && file === 'reset') {
        mockfs(structure);
        console.log('\nResetting filesystem contents');
      }
      else {
        console.log(method + ' ' + file);
      }
      event.next();
    });
  }
});

// Start a new DAV server with the configuration defined above.
jsdav.createServer({
  node: __dirname + '/' + config.ASSETS_DIRECTORY,
  plugins: util.extend(server.DEFAULT_PLUGINS, {rebuilder: rebuilder})
}, config.PORT);

mockfs(structure);
