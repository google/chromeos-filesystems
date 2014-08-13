// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use-strict';

/**
 * Component that wraps core-list to provide a list of all S3 buckets currently
 * mounted as file systems.
 */
Polymer('bucket-list', {
  /**
   * Initialises a new list with the currently stored list of buckets.
   * @constructs
   */
  ready: function() {
    // Keep the UI in sync with the data model.
    this.$.corelist.sync = true;

    var that = this;
    this.selected = null;

    chrome.storage.sync.get('buckets', function(items) {
      var buckets = items.buckets;

      if (!buckets || buckets.length === 0) {
        // TODO(lavelle): display this message in the element itself.
        // See: https://github.com/Polymer/core-list/issues/12
        console.log('No buckets mounted. Click the button above to add one.');
        that.data = [];
      } else {
        that.data = buckets;
      }
    });
  },

  /**
   * Prevents creation of duplicate buckets.
   * @param {string} name The name of the bucket to check.
   * @return {boolean} Whether or not the bucket already exists.
   */
  ensureUnique: function(name) {
    var current = _.find(this.data, function(item) {
      return item.name === name;
    });

    if (current) {
      s3fs.tm.show('bucketAlreadyMounted');
      return false;
    }

    return true;
  },

  /**
   * Adds a new bucket to the list.
   * @param {Object} data The Polymer event.
   * @param {Object} detail The custom data sent via the Polymer event.
   * @param {Object} sender The object that fired the event.
   */
  addServer: function(data, detail, sender) {
    // Ensure the bucket name is unique.
    if (!this.ensureUnique(data.detail.name)) { return; }

    this.data.push(data.detail);
    this.update();
  },

  /**
   * Removes a bucket from the list.
   * @param {Object} data The Polymer event.
   * @param {Object} detail The custom data sent via the Polymer event.
   * @param {Object} sender The object that fired the event.
   */
  removeBucket: function(data, detail, sender) {
    this.data = this.data.filter(function(item) {
      return item.name !== detail.name;
    });

    this.update();
  },

  /**
   * Updates the name and region of a bucket in the list.
   * @param {string} name The name of the bucket.
   * @param {string} region The region of the bucket.
   */
  updateBucket: function(name, region) {
    if (!this.ensureUnique(name)) { return; }

    var that = this;
    var selected = _.find(this.data, function(item) {
      return item.name === that.selected;
    });

    selected.name = name;
    selected.region = region;

    this.update();
  },

  /**
   * Updates the internal reference to the most recently selected list item.
   * @param {Object} data The Polymer event.
   * @param {Object} detail The custom data sent via the Polymer event.
   * @param {Object} sender The object that fired the event.
   */
  setSelected: function(data, detail, sender) {
    this.selected = detail.name;
  },

  /**
   * Called whenever a bucket is added, edited or removed.
   */
  update: function() {
    // console.log(this.$.corelist.data.selected);
    this.$.corelist.refresh();
    this.persist();
  },

  /**
   * Persists the bucket data from the list to Chrome's synchronised data store.
   */
  persist: function() {
    chrome.storage.sync.set({buckets: this.data});
  }
});
