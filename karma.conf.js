// Karma configuration.
module.exports = function(config) {
  config.set({
    // Base path that will be used to resolve all patterns.
    basePath: 'test',

    // Testing/assertion frameworks to use.
    frameworks: ['mocha', 'chai'],

    // List of files / patterns to load in the browser.
    files: ['build/*.js'],

    // List of files to exclude.
    exclude: [],

    // Preprocess matching files before serving them to the browser.
    preprocessors: {},

    // Test results reporter to use.
    // Possible values: 'dots', 'progress'.
    reporters: ['progress'],

    // Web server port.
    port: 9876,

    // Enable/disable colors in the output (reporters and logs).
    colors: true,

    // Level of logging.
    // Possible values: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG.
    logLevel: config.LOG_INFO,

    // Enable/disable watching file and executing tests whenever any file
    // changes.
    autoWatch: true,

    // Start these browsers.
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // Only use Firefox because it's the only one that works on Travis CI.
    // TODO(lavelle): add separate build test targets so that Chrome and
    // Firefox are used locally, and only Firefox on Travis.
    browsers: ['Firefox'],

    // Continuous Integration mode.
    // If true, Karma captures browsers, runs the tests and exits.
    singleRun: true
  });
};
