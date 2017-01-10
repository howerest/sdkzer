// Karma configuration
// Generated on Sun Jan 08 2017 05:49:52 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-typescript'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: "node_modules/babel-polyfill/dist/polyfill.js"},
      { pattern: "node_modules/jasmine-ajax/lib/mock-ajax.js"},
      { pattern: "node_modules/js-webservices/src/*.ts" },
      { pattern: "src/**/*.ts" }
    ],


    preprocessors: {
      "node_modules/js-webservices/src/*.ts": ["karma-typescript"],
      "src/**/*.ts" : ["karma-typescript"]
    },


    karmaTypescriptConfig: {
      compilerOptions: {
        lib: ["dom", "es5"],
        moduleResolution: "node"
      }
    },


    captureTimeout: 60000,
    browserDisconnectTimeout : 10000,
    browserDisconnectTolerance : 1,
    browserNoActivityTimeout : 60000,

    client: {
      captureConsole: true,
      mocha: {
        bail: false
      }
    },


    // list of files to exclude
    exclude: [
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'karma-typescript'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    usePolling: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
