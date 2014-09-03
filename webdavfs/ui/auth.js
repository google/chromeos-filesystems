// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var internationalise = require('../../shared/i18n');

window.chrome = window.chrome || {};

// Create a function for the Chrome i18n API if it doesn't exist the allow the
// page to be tested as a normal browser page.
if (!chrome.i18n) {
  chrome.i18n = {
    getMessage: function(name) {
      return name;
    }
  };
}

var keys = ['url'];

var fields = {};

keys.forEach(function(name) {
  fields[name] = document.getElementById(name);
});

var button = document.getElementById('mount');

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

restoreCredentials();
internationalise();

button.addEventListener('click', function(event) {
  event.preventDefault();

  button.setAttribute('disabled', 'true');

  document.getElementById('toast-mount-attempt').show();

  var request = {
    type: 'mount'
  };

  for (var key in fields) {
    request[key] = fields[key].value;
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
