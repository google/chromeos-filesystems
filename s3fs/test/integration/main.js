// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict'

var url = 'http://localhost:9000/build.html';

module.exports = {
  'Page title is correct': function(test) {
    test.open(url).assert.title('mountHeader', 'It has title').done();
  },

  'Fields are visible': function(test) {
    test.assert.chain()
      .visible('#bucket')
      .visible('#region')
      .visible('#access')
      .visible('#secret')
    end().done();
  },

  'Bucket label is correct': function(test) {
    test.assert.attr('#bucket', 'label', 'bucketName').done();
  },

  'Region label is correct': function(test) {
    test.assert.attr('#region', 'label', 'bucketRegion').done();
  },

  'Access label is correct': function(test) {
    test.assert.attr('#access', 'label', 'accessKey').done();
  },

  'Secret label is correct': function(test) {
    test.assert.attr('#secret', 'label', 'secretKey').done();
  },

  'Header is visible and displsys correct text': function(test) {
    test.query('h1')
      .assert.visible()
      .assert.text('mountHeader')
    .end().done();
  },

  'Mount button is visible and displays correct label': function(test) {
    test.query('#mount')
      .assert.visible()
      .assert.attr('label', 'mount')
    .end().done();
  },

  'Message is shown when attempting to mount bucket': function(test) {
    test
      .click('#mount')
      .assert.visible('#toast-mount-attempt')
      .done();
  },

  'Button should become disabled immediately after being clicked': function(test) {
    test.open(url).query('#mount')
      .assert.attr('disabled', null)
      .click()
      .assert.attr('disabled', 'true')
      .done();
  }
};
