// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var assert = require('assert');
var util = require('../../js/util');

describe('extend', function() {
  var result;

  it('can extend an object with the attributes of another', function() {
    util.extend({}, {a: 'b'}).a.should.equal('b');
  });

  it('properties in source override destination', function() {
    util.extend({a: 'x'}, {a: 'b'}).a.should.equal('b');
  });

  it("properties not in source don't get overriden", function() {
    util.extend({x: 'x'}, {a: 'b'}).x.should.equal('x');
  });

  it("can extend from multiple source objects", function() {
    util.extend({x: 'x'}, {a: 'a'}, {b: 'b'}).should.deep.equal({x: 'x', a: 'a', b: 'b'});
  });

  it("gives priority to last property when extending from multiple source objects", function() {
    util.extend({x: 'x'}, {a: 'a', x: 2}, {a: 'b'}).should.deep.equal({x: 2, a: 'b'});
  });

  it("should copy undefined values", function() {
    var result = util.extend({}, {a: void 0, b: null});
    should.equal(result.a, undefined);
    should.equal(result.b, null);
  });

  it("should not error on `null` or `undefined` sources", function() {
    try {
      result = {};
      util.extend(result, null, undefined, {a: 1});
    } catch(ex) {}

    result.a.should.equal(1);
  });
});

