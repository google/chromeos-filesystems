// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var fs = require('fs');
var _ = require('underscore');
var prompt = require('prompt');
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

var schema = {
  properties: {
    name: {
      required: true,
      description: 'Name your provider',
      pattern: /[a-z0-9]+/
    },
    displayName: {
      required: true,
      description: 'Name to be shown to users'
    },
    description: {
      required: true,
      description: 'Describe your provider'
    },
    author: {
      required: true,
      description: 'Your name'
    }
  }
};

prompt.get(schema, function(error, config) {
  if (error) {
    fatal('Scaffolding cancelled.');
  }

  var src = '../templatefs/*';
  var out = '../' + config.name + 'fs';

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
  var message = 'Your new provider ' + config.name + ' has been generated.';
  console.log(message.green);
});
