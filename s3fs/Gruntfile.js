module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Performs static analysis on the code to check for common errors.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        strict: false,
        // Browserify provides a Node-like environement, so this is true.
        node: true,
        // Chrome extensions have access to browser APIs, so this is true.
        browser: true,
        globals: {
          chrome: true,
          AWS: true,
          s3fs: true
        }
      },
      // Lint this file.
      gruntfile: {
        src: 'Gruntfile.js'
      },
      // Lint the main source files for the extension.
      src: {
        src: ['js/**/*.js']
      },
      // Lint the unit test specification files.
      test: {
        src: ['test/spec/*.js'],
        options: {
          unused: false,
          globals: {
            // Global functions exposed by the Mocha test framework.
            it: true,
            describe: true,
            // Global functions exposed by the Chai assertion library.
            should: true,
            // Application globals.
            s3fs: true,
            AWS: true
          }
        }
      },
      ui: {
        src: ['ui/auth.js'],
        options: {
          unused: false,
          // Polymer is capitalised and so treated as a constructor by jshint,
          // but should not be used with `new`.
          newcap: false,
          globals: {
            Polymer: true,
            chrome: true
          }
        }
      }
    },

    // Automatically resolves dependencies and bundles modules into a single
    // JavaScript file for distribution.
    browserify: {
      // Bundles the main extension source code into a single file for
      // distribution.
      src: {
        files: {
          'extension/background.js': 'js/main.js'
        }
      },
      // Bundles the test spec files and their dependencies.
      test: {
        expand: true,
        cwd: 'test/spec',
        src: '**/*.js',
        dest: 'test/build',
        ext: '.js',
        options: {}
      },
      ui: {
        files: {
          'ui/build.js': 'ui/auth.js'
        }
      }
    },

    // Runs the unit test suite in a headless WebKit instance.
    mocha: {
      src: ['test/index.html'],
      options: {
        // Report test results in full detail, instead of the default minimal
        // view.
        reporter: 'Spec',
        // Enable console.log within tests for debugging.
        log: true,
        // Show full error stack traces for debugging.
        logErrors: true
      }
    },

    connect: {
      dalek: {
        options: {
          port: 9000,
          base: 'extension'
        }
      }
    },

    dalek: {
      main: {
        options: {
          browser: ['chrome']
        },
        src: ['test/integration/main.js']
      }
    },

    // Combines Polymer web components into a single file.
    vulcanize: {
      main: {
        options: {
          csp: true,
          inline: true
        },
        files: {
          'extension/build.html': 'ui/auth.html'
        }
      }
    }
  });

  // Load all the plugins needed to run the tasks.
  require('load-grunt-tasks')(grunt);

  // Register aliases for common groups of tasks.

  // Src task lints the source code and bundles it for distribution.
  grunt.registerTask('src', ['jshint:src', 'browserify:src']);

  // Test task lints the test specifications themselves, bundles them and runs
  // them.
  grunt.registerTask('test', ['jshint:test', 'browserify:test', 'mocha']);

  // Lints the scripts for the UI, bundles them and then combines all the web
  // component assets into a single file.
  grunt.registerTask('ui', ['jshint:ui', 'browserify:ui', 'vulcanize']);

  // Runs integration tests using DalekJS.
  grunt.registerTask('itest', ['connect:dalek', 'dalek']);

  grunt.registerTask('default', ['src', 'ui']);
};
