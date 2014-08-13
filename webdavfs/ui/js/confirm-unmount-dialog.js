// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use-strict';

/**
 * Component used to prompt the user for confirmation when they click the
 * button to unmount a bucket.
 */
Polymer('confirm-unmount-dialog', {
  /**
   * Opens the dialog box.
   */
  open: function(data) {
    console.log(data.detail);

    // Store a reference to the list item that initiated the request, so a
    // message can later be sent back to that list item telling it to unmount
    // its bucket if the user clicks on 'yes'.
    this.caller = data.detail.caller;

    // Using .toggle() because the dialog is guaranteed to be closed when this
    // is called, and setting .opened = true doesn't work.
    this.$.dialog.toggle();
  },

  /**
   * Responds to the user cancelling the request to unmount the bucket.
   */
  onNoClicked: function() {
    console.log('no');
  },

  /**
   * Responds to the user confirming the request to unmount the bucket.
   */
  onYesClicked: function() {
    console.log('yes');
    this.caller.fire('delete-confirmed');
  }
});
