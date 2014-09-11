// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var events = require('../../js/events');

var onReadFileRequested = events.onReadFileRequested;
var onOpenFileRequested = events.onOpenFileRequested;
var onCloseFileRequested = events.onCloseFileRequested;
var onGetMetadataRequested = events.onGetMetadataRequested;
var onReadDirectoryRequested = events.onReadDirectoryRequested;
var onWriteFileRequested = events.onWriteFileRequested;
var onTruncateRequested = events.onTruncateRequested;
var onCreateFileRequested = events.onCreateFileRequested;
var onDeleteEntryRequested = events.onDeleteEntryRequested;
var onCopyEntryRequested = events.onCopyEntryRequested;
var onMoveEntryRequested = events.onMoveEntryRequested;

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

testSuite = require('../../../shared_tests/onTruncateRequested');
testSuite(onTruncateRequested, onReadFileRequested, onOpenFileRequested);

testSuite = require('../../../shared_tests/onCopyEntryRequested');
testSuite(onCopyEntryRequested, onGetMetadataRequested);

testSuite = require('../../../shared_tests/onMoveEntryRequested');
testSuite(onMoveEntryRequested, onGetMetadataRequested);
