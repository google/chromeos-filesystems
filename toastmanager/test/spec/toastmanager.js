// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use-strict';

var ToastManager = require('../../toastmanager');

var tm = new ToastManager();

describe('ToastManager', function() {
  it('should have a default delay', function() {
    tm.delay.should.equal(2000);
  });

  it('should have a default prefix', function() {
    tm.prefix.should.equal('toast');
  });

  it('should have an empty set of toasts before building', function() {
    tm.toasts.should.be.an('object');
  });

  describe('makeSelector', function() {
    it('should create the correct selector', function() {
      tm.makeSelector('cool-name').should.equal('#toast-cool-name');
    });
  });

  describe('makeKey', function() {
    it('should create the correct key', function() {
      tm.makeKey('really-cool-name').should.equal('reallyCoolName');
    });
  });
});
