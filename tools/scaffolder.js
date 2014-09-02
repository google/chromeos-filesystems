// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var fs = require('fs');
var _ = require('underscore');
require('shelljs/global');
require('colors');

var textExtensions = ['txt', 'js', 'json', 'html', 'css', 'md'];

// Mustache-style curly-brace template variables eg. Hello {{ name }}!
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

// Convenience function to read the contents of a file.
var read = function(path) {
  return fs.readFileSync(path, 'utf-8');
};

// Convenience function for displaying an error message and terminating the
// program.
var fatal = function(message) {
  console.error(message.red);
  process.exit(1);
};

var name = 'cool';
var src = '../templatefs/*';
var out = '../' + name + 'fs';

// TODO(lavelle): read these values from stdin.
var config = {
  name: name,
  long_name: 'Cool',
  description: 'a cool provider',
  location: 'A cool cloud service'
};

// Ensure we won't be overwriting any existing files.
if (fs.existsSync(out)) {
  fatal('Error: directory ' + out + ' already exists.');
}

// Copy the template filesystem to the new directory.
cp('-r', src, out);

// Run the contents of each text file through the templater to fill out values.
ls('-R', out).forEach(function(file) {
  // Ignore directories.
  if (file.indexOf('.') === -1) { return; }
  // Ignore non-text files.
  var extension = file.split('.').pop();
  if (textExtensions.indexOf(extension) === -1) { return; }

  file = out + '/' + file;

  // Template each file.
  var contents = read(file);
  var template = _.template(contents);
  var output = template(config);

  fs.writeFileSync(file, output);
});

// Show a success message.
var message = 'Your new provider ' + name + ' has been generated.';
console.log(message.green);
