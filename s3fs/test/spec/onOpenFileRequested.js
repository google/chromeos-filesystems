// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

/* jshint -W027 */

'use strict';

var onOpenFileRequested = require('../../js/events/onOpenFileRequested');

var testSuite = require('../../../shared_tests/onOpenFileRequested');

testSuite(s3fs, onOpenFileRequested);
