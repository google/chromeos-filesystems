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
            beforeEach: true,
            webDAVFS: true,
            arrayBufferToString: true,
            TextDecoder: true
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
      ui: {
        files: {
          'ui/build.js': 'ui/auth.js'
        }
      }
    },

    karma: {
      options: {
        basePath: 'webdavfs/test/build',
        files: [
          'helper.js',
          'client.js',
          'wdfs.js',
          'events.js'
        ],
        configFile: '../karma.conf.js'
      },
      unit: {}
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

  // Load all grunt plugins needed to run the tasks.
  require('load-grunt-tasks')(grunt);

  // Register task aliases.
  grunt.registerTask('src', ['jshint:src', 'browserify:src']);
  grunt.registerTask('test', ['jshint:test', 'browserify:test', 'karma']);
  grunt.registerTask('ui', ['jshint:ui', 'browserify:ui', 'vulcanize']);
  grunt.registerTask('docs', ['jsdoc']);
  grunt.registerTask('lint', ['jshint:gruntfile', 'jshint:src', 'jshint:test',
    'jshint:ui', 'jsonlint']);

  grunt.registerTask('default', ['src', 'ui']);
};
