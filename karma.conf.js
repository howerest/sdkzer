// Karma configuration
// Generated on Sun Apr 19 2015 02:03:27 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    frameworks: ['jasmine'],

    // files && patterns to load in the browser
    files: [
      // Dependencies
      { pattern: 'node_modules/jasmine-ajax/lib/mock-ajax.js', included: true },
      { pattern: 'node_modules/es6-promise/dist/es6-promise.min.js', included: true },
      { pattern: 'node_modules/js-webservices/js/util.js', included: true },
      { pattern: 'node_modules/js-webservices/js/web_services.js', included: true },

      // Sdkzer
      { pattern: 'js/ts/howerest.modularizer.js', included: true },
      { pattern: 'js/ts/howerest.sdkzer.js', included: true },

      // Test data
      { pattern: 'js/ts/spec/fixtures.js', included: true },

      // Specs
      { pattern: 'js/ts/spec/**/sdkzer_spec.js', included: true },
    ],


    // list of files to exclude
    exclude: [

    ],

    client: {
      captureConsole: true,
      mocha: {
        bail: false
      }
    },

    // test results reporter to use
    // 'dots', 'progress', 'html'
    reporters: ['mocha', 'growl'],// , 'html'],
    // jasmine html report at: url/debug.html

    // web server port
    port: 9876,

    usePolling: true,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
