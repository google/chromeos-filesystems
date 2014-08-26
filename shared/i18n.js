// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

module.exports = function() {
  var selector = 'data-message';
  var elements = document.querySelectorAll('[' + selector + ']');

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    var messageID = element.getAttribute(selector);
    var messageText = chrome.i18n.getMessage(messageID);

    switch(element.tagName.toLowerCase()) {
      case 'paper-input':
      case 'paper-button':
        element.setAttribute('label', messageText);
        break;
      case 'paper-toast':
        element.setAttribute('text', messageText);
        break;
      case 'h1':
      case 'title':
        element.innerText = messageText;
        break;
    }
  }
};
