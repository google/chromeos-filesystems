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
        src: ['test/spec/*.js'],
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
      },
      ui: {
        src: ['ui/js/**/*.js'],
        options: {
          unused: false,
          // Polymer is capitalised and so treated as a constructor by jshint,
          // but should not be used with `new`.
          newcap: false,
          globals: {
            Polymer: true,
            $: true,
            _: true,
            s3fs: true,
            chrome: true
          }
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
        cwd: 'test/spec',
        src: '**/*.js',
        dest: 'test/build',
        ext: '.js',
        options: {}
      },
      // Bundles scripts used for the file system UI.
      ui: {
        expand: true,
        cwd: 'ui/js',
        src: '*.js',
        dest: 'ui/build',
        ext: '.js',
        options: {}
      }
    },
    // Runs the unit test suite in a headless Webkit instance.
    mocha: {
      src: ['test/index.html'],
      options: {
        reporter: 'Spec',
        log: true,
        logErrors: true
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
          'extension/build.html': 'ui/html/index.html'
        }
      }
    }
  });

  // Load all grunt plugins needed to run the tasks.
  require('load-grunt-tasks')(grunt);

  // Register task aliases.
  grunt.registerTask('src', ['jshint:src', 'browserify:src']);
  grunt.registerTask('test', ['jshint:test', 'browserify:test', 'mocha']);
  grunt.registerTask('ui', ['jshint:ui', 'browserify:ui', 'vulcanize']);
  grunt.registerTask('default', ['src', 'ui']);
};
