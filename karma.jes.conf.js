/*global module process */

var _ = require('lodash');

module.exports = function(config) {
    "use strict";

    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: ['mocha', 'chai'],

        // list of files / patterns to load in the browser
        files: ['libs/lodash.js'].concat(
            [
                'node_modules/chevrotain/bin/chevrotain.js',

                {pattern: 'bin/gen/src/pudu/**/*.map', included: false},
                {pattern: 'bin/gen/src/jes/**/*.map', included: false},
                {pattern: 'bin/gen/test/jes/**/*.map', included: false},

                {pattern: 'src/**/*.ts', included: false},
                {pattern: 'test/**/*.ts', included: false},

                {pattern: 'bin/gen/src/pudu/**/*.js'},

                {pattern: 'bin/gen/src/jes/**/*.js'},
                {pattern: 'bin/gen/test/jes/**/*.js'}
            ]),

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],

        // web server port
        port: 9979,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout:           10000000,
        browserNoActivityTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
