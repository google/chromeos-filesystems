// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var FILE_SYSTEM_ID = 'fileSystemId';
var REQUEST_ID = 10;

describe('Decompressor', function() {
  var naclModule;
  var decompressor;
  var onSuccessSpy;
  var onErrorSpy;

  beforeEach(function() {
    naclModule = {
      postMessage: sinon.spy()
    };
    decompressor = new Decompressor(naclModule, FILE_SYSTEM_ID);
    onSuccessSpy = sinon.spy();
    onErrorSpy = sinon.spy();
  });

  it('should not have any requests in progress if no method was called',
      function() {
    expect(Object.keys(decompressor.requestsInProgress).length).to.equal(0);
  });

  describe('that reads metadata', function() {
    beforeEach(function() {
      decompressor.readMetadata(REQUEST_ID, onSuccessSpy, onErrorSpy);
    });

    it('should add a new request in progress', function() {
      expect(decompressor.requestsInProgress[REQUEST_ID]).to.not.be.undefined;
    });

    it('should call naclModule.postMessage once', function() {
      expect(naclModule.postMessage.calledOnce).to.be.true;
    });

    it('should call naclModule.postMessage with read metadata request',
        function() {
      var readMetadataRequest =
          request.createReadMetadataRequest(FILE_SYSTEM_ID, REQUEST_ID);
      expect(naclModule.postMessage.calledWith(readMetadataRequest)).to.be.true;
    });

    // Test READ_METADATA_DONE.
    describe('and receives a processMessage with READ_METADATA_DONE',
             function() {
      var data = {};
      beforeEach(function() {
        data[request.Key.METADATA] = 'metadata';  // Not important.
        decompressor.processMessage(data,
                                    request.Operation.READ_METADATA_DONE,
                                    REQUEST_ID);
      });

      it('should call onSuccess with the metadata', function() {
        expect(onSuccessSpy.calledWith(data[request.Key.METADATA])).to.be.true;
      });

      it('should not call onError', function() {
        expect(onErrorSpy.called).to.be.false;
      });

      it('should remove the request in progress', function() {
        expect(decompressor.requestsInProgress[REQUEST_ID]).to.be.undefined;
      });
    });

    // Test FILE_SYSTEM_ERROR.
    describe('and receives a processMessage with FILE_SYSTEM_ERROR',
             function() {
      beforeEach(function() {
        decompressor.processMessage({} /* Not important. */,
                                    request.Operation.FILE_SYSTEM_ERROR,
                                    REQUEST_ID);
      });

      it('should not call onSuccess', function() {
        expect(onSuccessSpy.called).to.be.false;
      });

      it('should call onError with FAILED', function() {
        expect(onErrorSpy.calledWith('FAILED')).to.be.true;
      });

      it('should remove the request in progress', function() {
        expect(decompressor.requestsInProgress[REQUEST_ID]).to.be.undefined;
      });
    });
  });
});
