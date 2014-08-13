// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use-strict';

Polymer('bucket-item', {
  ready: function() {
    this.list = $('bucket-list')[0];
  },
  getName: function() {
    return $(this).find('.name').text();
  },
  getRegion: function() {
    return $(this).find('.region').text();
  },
  textClicked: function() {
    s3fs.fields.name.val(this.getName());
    s3fs.fields.region.val(this.getRegion());

    var name = this.getName();

    this.list.fire('set-selected', {name: name});
  },
  deleteClicked: function() {
    s3fs.dialogs.confirmUnmount.fire('open', {caller: this});
  },
  deleteConfirmed: function() {
    var name = this.getName();
    this.list.fire('remove-bucket', {name: name});
  }
});
