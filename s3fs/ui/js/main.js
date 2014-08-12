// Copyright 2014 Google Inc. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use-strict';

// Global app namespace.
window.s3fs = {};

var AWSValidator = require('./lib/awsvalidator');
var ToastManager = require('../../../third_party/toastmanager/toastmanager');

s3fs.tm = new ToastManager({
  names: [
    'access-key', 'secret-key', 'bucket-name', 'region', 'credentials-saved',
    'nothing-mounted', 'bucket-updated', 'bucket-already-mounted',
    'networking-error'
  ]
});

s3fs.validator = new AWSValidator();

/**
 * Loads AWS credentials from storage and displays them in the text fields.
 */
var restoreCredentials = function() {
  chrome.storage.sync.get(['accessKey', 'secretKey'], function(items) {
    if (items.accessKey) {
      // Need to use .attr() instead of .val() because Polymer's paper-input
      // doesn't behave like a normal <input>.
      s3fs.fields.key.attr('value', items.accessKey);
    }

    if (items.secretKey) {
      s3fs.fields.secret.attr('value', items.secretKey);
    }
  });
};

$(function() {
  // Store references to the (jQuery-wrapped) text fields.
  s3fs.fields = {
    name: $('#name'),
    region: $('#region'),
    key: $('#key'),
    secret: $('#secret')
  };

  s3fs.tm.build();

  // Store references to the confirmation dialogs (replaces window.confirm()).
  s3fs.dialogs = {
    confirmUnmount: $('confirm-unmount-dialog')[0]
  };

  // Reference to the main bucket list element/object.
  var list = $('bucket-list')[0];

  // Remounts the selected bucket.
  $('#mount').on('click', function(event) {
    // Ensure the user has selected a bucket.
    if (list.selected === null) {
      // Show an error message if not.
      s3fs.tm.show('nothingMounted');
      return;
    }

    // Get the bucket name and region from the text fields.
    var name = s3fs.fields.name.val();
    var region = s3fs.fields.region.val();

    // Ensure the bucket name is present and valid.
    if (!s3fs.validator.bucketName(name)) {
      s3fs.tm.show('bucketName');
      return;
    }

    // Ensure that the region is present and valid.
    if (!s3fs.validator.region(region)) {
      s3fs.tm.show('region');
      return;
    }

    // Update the selected bucket in the list.
    list.updateBucket(name, region);

    // Send the request to the backend script.
    var request = {
      type: 'mount',
      bucket: name,
      region: region
    };

    // Send the request to the background script to mount the bucket.
    chrome.runtime.sendMessage(request, function(response) {
      console.log(response);

      if (response.success) {
        // Show a confirmation message.
        s3fs.tm.show('bucketUpdated');
      }
      else {
        // TODO(lavelle): display meaningful error message to the user here via
        // toast.
        console.error(response.error);

        if (response.error.code === 'NetworkingError') {
          s3fs.tm.show('networkingError');
        }
      }
    });
  });

  // Saves the new secret and access keys.
  $('#update').on('click', function() {
    // Get the values from the fields.
    var key = s3fs.fields.key.val();
    var secret = s3fs.fields.secret.val();

    // Ensure there is a valid access key to save.
    if (!s3fs.validator.accessKey(key)) {
      // Show an error message if it fails.
      s3fs.tm.show('accessKey');
      return;
    }

    // Ensure there is a valid secret key to save.
    if (!s3fs.validator.secretKey(secret)) {
      // Show an error message if it fails.
      s3fs.tm.show('secretKey');
      return;
    }

    // Save the credentials to persistent storage.
    chrome.storage.sync.set({
      accessKey: key,
      secretKey: secret
    });

    // Show a confirmation message.
    s3fs.tm.show('credentialsSaved');
  });

  // Restore the AWS credentials from storage.
  restoreCredentials();
});
