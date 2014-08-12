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
        // TODO(lavelle): Reset this. Several callbacks are not used yet but
        // will be eventually.
        unused: false,
        boss: true,
        eqnull: true,
        expr: true,
        node: true,
        browser: true,
        globals: {
          chrome: true,
          webDAVFS: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/**/*.js']
      },
      test: {
        src: ['test/browser/spec/*.js'],
        options: {
          expr: true,
          globals: {
            it: true,
            describe: true,
            should: true,
            before: true,
            webDAVFS: true,
            arrayBufferToString: true
          }
        }
      }
    },
    // Runs a local HTTP server to access static files in the directory for
    // manual testing.
    connect: {
      server: {
        options: {
          port: 9000,
          base: '.',
          keepalive: true
        }
      }
    },
    // Automatically resolves dependencies and bundles modules into a single
    // JavaScript file for deployment.
    browserify: {
      src: {
        files: {
          'extension/background.js': 'js/main.js'
        }
      },
      test: {
        expand: true,
        cwd: 'test/browser/spec',
        src: '**/*.js',
        dest: 'test/browser/build',
        ext: '.js',
        options: {}
      }
    },
    // Runs the unit test suite in a headless Webkit instance.
    mocha: {
      src: ['test/browser/index.html'],
      options: {
        reporter: 'Spec',
        log: true,
        logErrors: true
      }
    }
  });

  // Load all grunt plugins needed to run the tasks.
  require('load-grunt-tasks')(grunt);

  // Register task aliases.
  grunt.registerTask('default', ['jshint:src', 'browserify:src']);
  grunt.registerTask('test', ['jshint:test', 'browserify:test', 'mocha']);
};
