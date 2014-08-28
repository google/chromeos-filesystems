// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var events = require('../../js/events');

var onReadFileRequested = events.onReadFileRequested;
var onOpenFileRequested = events.onOpenFileRequested;
var onCloseFileRequested = events.onOpenFileRequested;
var onGetMetadataRequested = events.onGetMetadataRequested;
var onReadDirectoryRequested = events.onReadDirectoryRequested;

var testSuite = require('../../../shared_tests/onReadFileRequested');
testSuite(onReadFileRequested, onOpenFileRequested);

testSuite = require('../../../shared_tests/onOpenFileRequested');
testSuite(webDAVFS, onOpenFileRequested);

testSuite = require('../../../shared_tests/onCloseFileRequested');
testSuite(webDAVFS, onCloseFileRequested);

testSuite = require('../../../shared_tests/onGetMetadataRequested');
testSuite(onGetMetadataRequested);

testSuite = require('../../../shared_tests/onReadDirectoryRequested');
testSuite(onReadDirectoryRequested);
