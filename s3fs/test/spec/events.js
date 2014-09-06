// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var onReadFileRequested = require('../../js/events/onReadFileRequested');
var onWriteFileRequested = require('../../js/events/onWriteFileRequested');
var onCreateFileRequested = require('../../js/events/onCreateFileRequested');
var onOpenFileRequested = require('../../js/events/onOpenFileRequested');
var onCloseFileRequested = require('../../js/events/onCloseFileRequested');
var onGetMetadataRequested = require('../../js/events/onGetMetadataRequested');
var onDeleteEntryRequested = require('../../js/events/onDeleteEntryRequested');
var onReadDirectoryRequested =
  require('../../js/events/onReadDirectoryRequested');

var testSuite = require('../../../shared_tests/onReadFileRequested');
testSuite(onReadFileRequested, onOpenFileRequested);

testSuite = require('../../../shared_tests/onOpenFileRequested');
testSuite('s3fs', onOpenFileRequested);

testSuite = require('../../../shared_tests/onCloseFileRequested');
testSuite('s3fs', onCloseFileRequested);

testSuite = require('../../../shared_tests/onGetMetadataRequested');
testSuite(onGetMetadataRequested);

testSuite = require('../../../shared_tests/onReadDirectoryRequested');
testSuite(onReadDirectoryRequested);

testSuite = require('../../../shared_tests/onWriteFileRequested');
testSuite(onWriteFileRequested, onReadFileRequested, onOpenFileRequested);

testSuite = require('../../../shared_tests/onDeleteEntryRequested');
testSuite(onDeleteEntryRequested, onGetMetadataRequested);

testSuite = require('../../../shared_tests/onCreateFileRequested');
testSuite(onCreateFileRequested, onGetMetadataRequested);
