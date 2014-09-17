// Karma configuration.
module.exports = function(config) {
  config.set({
    // Testing/assertion frameworks to use.
    frameworks: ['mocha', 'chai'],

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

    // Continuous Integration mode.
    // If true, Karma captures browsers, runs the tests and exits.
    singleRun: true,

    customLaunchers: {
      ChromeTravis: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  });
};
