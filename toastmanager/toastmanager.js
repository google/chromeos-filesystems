// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use-strict';

/**
 * Class for managing toasts, small UI elements that display a message to the
 * user.
 */
var ToastManager = function(options) {
  options = options || {};
  // Prefix used to namespace toast IDs.
  this.prefix = options.prefix || 'toast';
  // Time to show the toast for in milliseconds.
  this.delay = options.delay || 2000;
  // Object used to store toast references.
  this.toasts = {};
  // Names of toasts.
  this.names = options.names || {};
};

/**
 * Creates a CSS selector string used to select the toast with the given name.
 * @param {string} name The name of the toast to select.
 * @return {string} The selector for this toast.
 */
ToastManager.prototype.makeSelector = function(name) {
  return '#' + this.prefix + '-' + name;
};

/**
 * Creates a camelcase key for the given toast used to uniquely identify it.
 * @param {string} name The name of the toast to select.
 * @example makeKey('my-cool-toast'); -> 'myCoolToast';
 * @return {string} The key for this toast.
 */
ToastManager.prototype.makeKey = function(name) {
  var parts = name.split('-');
  var key = parts[0];

  for (var i = 1; i < parts.length; i++) {
    var part = parts[i];
    key += part.substring(0, 1).toUpperCase() + part.substring(1);
  }

  return key;
};

/**
 * Builds the internal collection of toast object references.
 */
ToastManager.prototype.build = function() {
  var that = this;

  this.names.forEach(function(name) {
    var key = that.makeKey(name);
    var selector = that.makeSelector(name);
    that.toasts[key] = $(selector)[0];
  });
};

/**
 * Displays the toast with the given name.
 * @param {string} name The name of the toast to display.
 * @param {number} opt_delay The time in milliseconds to display the toast for.
 */
ToastManager.prototype.show = function(name, opt_delay) {
  var delay = opt_delay || this.delay;
  this.toasts[name].show(delay);
};

module.exports = ToastManager;
