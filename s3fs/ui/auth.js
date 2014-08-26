// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var AWSValidator = require('./awsvalidator');
var validator = new AWSValidator();
var internationalise = require('../../shared/i18n');

// Create a function for the Chrome i18n API if it doesn't exist the allow the
// page to be tested as a normal browser page.
if (!chrome.i18n) {
  chrome.i18n = {
    getMessage: function(name) {
      return name;
    }
  };
}

var keys = ['bucket', 'access', 'secret'];

var fields = {};

keys.forEach(function(name) {
  fields[name] = document.getElementById(name);
});

var button = document.getElementById('mount');

// Populate the regions datalist with the list from the validator.
var regionList = document.getElementById('region');

for (var i = 0; i < validator.regions.length; i++) {
  var region = validator.regions[i];

  var item = document.createElement('paper-item');
  item.setAttribute('label', region);

  regionList.appendChild(item);
}

// Restores previously saved credentials and autofills the text fields.
var restoreCredentials = function() {
  if (!chrome.storage) { return; }
  chrome.storage.sync.get(keys, function(items) {
    for (var key in items) {
      var value = items[key];

      if (value) {
        fields[key].value = value;
      }
    }
  });
};

var validate = function() {
  // Use a custom function here because it's too complex to be expressed by a
  // single regular expression.
  if (!validator.bucket(fields.bucket.value)) {
    document.getElementById('toast-invalid-bucket').show();
    return false;
  }

  // Only show a warning for these, instead of returning false. The format is
  // not as well defined, so the check is just a guideline, not a rule.
  if (!validator.access(fields.bucket.access)) {
    document.getElementById('toast-invalid-access').show();
  }

  if (!validator.secret(fields.bucket.secret)) {
    document.getElementById('toast-invalid-secret').show();
  }

  return true;
};

restoreCredentials();
internationalise();

button.addEventListener('click', function(event) {
  event.preventDefault();

  if (!validate()) { return; }

  button.setAttribute('disabled', 'true');

  document.getElementById('toast-mount-attempt').show();

  var request = {
    type: 'mount'
  };

  for (var key in fields) {
    request[key] = fields[key].value;
  }

  var regionSelector = document.getElementById('region');

  if (regionSelector.selectedItem) {
    request.region = regionSelector.selectedItem.label;
  } else {
    document.getElementById('toast-invalid-region').show();
    return;
  }

  chrome.runtime.sendMessage(request, function(response) {
    if (response.success) {
      document.getElementById('toast-mount-success').show();

      window.setTimeout(function() {
        window.close();
      }, 2000);
    } else {
      document.getElementById('toast-mount-fail').show();
      button.removeAttribute('disabled');
    }
  });
});
