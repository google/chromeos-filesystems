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
            before: true,
            beforeEach: true,
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
    },

    karma: {
      options: {
        basePath: 's3fs/test/build',
        files: [
          's3mock.js',
          'helper.js',
          's3fs.js',
          'events.js',
          'awsvalidator.js',
          'util.js'
        ],
        configFile: '../karma.conf.js'
      },
      unit: {}
    },

    jsdoc : {
      dist : {
        src: ['js/**/*.js'],
        options: {
          destination: 'docs',
          recurse: true
        }
      }
    },

    connect: {
      docs: {
        options: {
          base: 'docs',
          port: 4000,
          keepalive: true
        }
      }
    },

    copy: {
      main: {
        files: {
          'extension/aws-sdk.js': '../third_party/aws-sdk/dist/aws-sdk.min.js'
        }
      }
    },

    jsonlint: {
      all: {
        src: [
          'package.json',
          '../bower.json',
          'extension/manifest.json',
          'extension/_locales/**/*.json'
        ]
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
  grunt.registerTask('test', ['jshint:test', 'browserify:test', 'karma']);

  // Lints the scripts for the UI, bundles them and then combines all the web
  // component assets into a single file.
  grunt.registerTask('ui', ['jshint:ui', 'browserify:ui', 'vulcanize']);

  grunt.registerTask('docs', ['jsdoc']);

  grunt.registerTask('lint', ['jshint:gruntfile', 'jshint:src', 'jshint:test',
    'jshint:ui', 'jsonlint']);

  grunt.registerTask('default', ['src', 'ui']);
};
