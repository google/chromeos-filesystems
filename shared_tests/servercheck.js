// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

module.exports = function() {
  before(function(done){
    // Test the connection to the server and show an error message prompting
    // the user to start the server if it's not running.

    var message = 'Could not connect to server.\nPlease start it by ' +
      'typing `node server.js &` from the testserver directory.';

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) { return; }

      console.log(xhr.status);

      if (xhr.status < 200 || xhr.status >= 300) {
        throw new Error(message);
      }

      done();
    };

    xhr.open('GET', 'http://localhost:8000', true);
    xhr.setRequestHeader('Content-Type', 'text/xml; charset=UTF-8');
    xhr.send(null);
  });
};
