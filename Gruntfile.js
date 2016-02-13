module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      files: [
        './js/**/*.js'
      ],
      tasks: ['default']
    },

    //  Code concatenation
    // ------------------------------------------------------------------------
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';',
        uglify: false
      },
      release: {
        // the files to concatenate
        src: [
          //'node_modules/es6-promise/dist/es6-promise.js', // Add to this build if needed
          'js/howerest.modularizer.js',
          'js/howerest.sdkzer.js'
        ],
        // the location of the resulting JS file
        dest: 'release/howerest-sdkzer.js'
      }
    },

    //  Code uglification
    // ------------------------------------------------------------------------
    uglify: {
      options: {
        compress: {
          drop_console: true
        }
      },
      release: {
        files: {
          'release/howerest-sdkzer.js': ['release/howerest-sdkzer.js']
        }
      }
    },

    //  Karma runner (BDD)
    // ------------------------------------------------------------------------
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', [/*'ts', */ 'concat', 'uglify']);
};
