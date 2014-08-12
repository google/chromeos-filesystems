// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

describe('Unrar extension', function() {
  before(function(done) {
    expect(app.naclModuleIsLoaded()).to.be.false;

    // "base/" prefix is required because Karma prefixes every file path with
    // "base/" before serving it. No need for loading on DOMContentLoaded as the
    // DOM was already loaded by karma before tests are run.
    app.loadNaclModule('base/newlib/Debug/module.nmf',
                       'application/x-nacl',
                       function() {
      expect(app.naclModuleIsLoaded()).to.be.true;
      done();
    });
  });

  describe('should retrieve fake metadata', function() {
    var metadata = null;

    before(function(done) {
      app.loadVolume('mockFs', 'not_necessary', 'not_necessary', function() {
        metadata = app.volumes['mockFs'].metadata;
        done();
      }, function() {
        // Force failure, first 2 parameters don't matter.
        assert.fail(undefined, undefined, 'Could not load metadata');
        done();
      });
    });

    it('that is valid', function() {
      expect(metadata).to.not.be.null;
    });

    it('that has 9 entries', function() {
      expect(Object.keys(metadata).length).to.equal(9);
    });

    // Test root entry.
    describe('that has a root entry', function() {
      it('which is defined', function() {
        expect(metadata['/']).to.not.be.undefined;
      });

      it('with name "/"', function() {
        expect(metadata['/'].name).to.equal('/');
      });

      it('which is a directory', function() {
        expect(metadata['/'].isDirectory).to.be.true;
      });

      it('with size 0', function() {
        expect(metadata['/'].size).to.equal(0);
      });

      it('with modificationTime as a Date object', function() {
        expect(metadata['/'].modificationTime).to.be.a('Date');
      });
    });
  });

  // TODO(cmihail): Test saveState / restoreState / onSuspend, etc using spies.
});
