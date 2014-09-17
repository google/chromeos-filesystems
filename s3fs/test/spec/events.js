// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var events = require('../../js/events');

var onCopyEntryRequested = events.onCopyEntryRequested;
var onCreateFileRequested = events.onCreateFileRequested;
var onCloseFileRequested = events.onCloseFileRequested;
var onDeleteEntryRequested = events.onDeleteEntryRequested;
var onGetMetadataRequested = events.onGetMetadataRequested;
var onMoveEntryRequested = events.onMoveEntryRequested;
var onOpenFileRequested = events.onOpenFileRequested;
var onReadFileRequested = events.onReadFileRequested;
var onReadDirectoryRequested = events.onReadDirectoryRequested;
var onTruncateRequested = events.onTruncateRequested;
var onWriteFileRequested = events.onWriteFileRequested;

var testSuite;

testSuite = require('../../../shared_tests/onCopyEntryRequested');
testSuite(onCopyEntryRequested, onGetMetadataRequested);

testSuite = require('../../../shared_tests/onCreateFileRequested');
testSuite(onCreateFileRequested, onGetMetadataRequested);

testSuite = require('../../../shared_tests/onCloseFileRequested');
testSuite(s3fs, onCloseFileRequested, onOpenFileRequested);

testSuite = require('../../../shared_tests/onDeleteEntryRequested');
testSuite(s3fs, onDeleteEntryRequested, onGetMetadataRequested);

testSuite = require('../../../shared_tests/onGetMetadataRequested');
testSuite(onGetMetadataRequested);

testSuite = require('../../../shared_tests/onMoveEntryRequested');
testSuite(onMoveEntryRequested, onGetMetadataRequested);

testSuite = require('../../../shared_tests/onOpenFileRequested');
testSuite(s3fs, onOpenFileRequested);

testSuite = require('../../../shared_tests/onReadFileRequested');
testSuite(onReadFileRequested, onOpenFileRequested);

testSuite = require('../../../shared_tests/onReadDirectoryRequested');
testSuite(onReadDirectoryRequested);

testSuite = require('../../../shared_tests/onTruncateRequested');
testSuite(onTruncateRequested, onReadFileRequested, onOpenFileRequested);

testSuite = require('../../../shared_tests/onWriteFileRequested');
testSuite(onWriteFileRequested, onReadFileRequested, onOpenFileRequested);
