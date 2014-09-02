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
            arrayBufferToString: true,
            TextDecoder: true
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
      }
    },

    karma: {
      unit: {
        configFile: '../karma.conf.js'
      }
    }
  });

  // Load all grunt plugins needed to run the tasks.
  require('load-grunt-tasks')(grunt);

  // Register task aliases.
  grunt.registerTask('src', ['jshint:src', 'browserify:src']);
  grunt.registerTask('test', ['jshint:test', 'browserify:test', 'karma']);
  grunt.registerTask('default', ['src']);
};
