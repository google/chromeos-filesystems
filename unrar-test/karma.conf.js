// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/**
 * Defines the configuration for the karma test runner.
 * @param {Object} config The karma config object.
 */
module.exports = function(config) {
  config.set({
    /**
     * Base path that will be used to resolve all patterns (eg. files, exclude).
     * @type {string}
     */
    basePath: '../unrar',

    /**
     * Frameworks to use. Available frameworks:
     * https://npmjs.org/browse/keyword/karma-adapter
     * @type {Array.<string>}
     */
    frameworks: ['mocha', 'chai', 'sinon'],

    /**
     * List of files / patterns to load in the browser.
     * @type {Array.<string>}
     */
    files: [
      // Application files. Only *.js files are included as <script>, the rest
      // only served.
      {pattern: 'newlib/*/*.nmf', watched: true, included: false, served: true},
      {pattern: 'newlib/*/*.[n|p]exe', watched: true, included: false,
                served: true},
      {pattern: 'js/*.js', watched: true, included: true, served: true},

      // Test files.
      '../unrar-test/js/*.js'
    ],

    /**
     * List of files to exclude.
     * @type {Array.<string>}
     */
    exclude: [
      'js/background.js' // Contains direct calls to chrome API.
    ],

    /**
     * Test results reporter to use. Possible values: 'dots', 'progress'.
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     * @type {Array.<string>}
     */
    reporters: ['progress'],

    /**
     * Web server port.
     * @type {number}
     */
    port: 9876,

    /**
     * Enable / disable colors in the output (reporters and logs).
     * @type {boolean}
     */
    colors: true,

    /**
     * The level of logging. Possible values:
     *     config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
     *     config.LOG_INFO || config.LOG_DEBUG
     * @type {string}
     */
    logLevel: config.LOG_INFO,

    /**
     * Enable / disable watching file and executing tests whenever any file
     * changes.
     * @type {boolean}
     */
    autoWatch: true,

    /**
     * Custom launchers to be used in browsers. A custom launcher is required in
     * order to enable Nacl for every application, even those that are not
     * installed from the Chrome market.
     * DO NOT use '--enable-nacl-debug' (the module won't be loaded normally
     * anymore, probably because of how the debugger connects to Chrome).
     * @type {Object.<string, Object>}
     */
    customLaunchers: {
      'Chrome-dev': {
        base: 'Chrome',
        flags: ['--disable-setuid-sandbox', '--enable-nacl']
      }
    },

    /**
     * The browsers to start. Only 'Chrome-dev' defined above is required
     * for the unrar extension.
     * @type {Array.<string>}
     */
    browsers: ['Chrome-dev'],

    /**
     * Continuous Integration mode. If true, Karma captures browsers,
     * runs the tests and exits.
     * @type {boolean}
     */
    singleRun: false
  });
};
