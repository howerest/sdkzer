module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      files: [
        './built/**/*.js'
      ],
      tasks: ['default']
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
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', [/*'ts', */ 'concat', 'uglify']);
};
