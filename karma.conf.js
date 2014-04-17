'use strict';

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-i18n/angular-locale_pt-br.js',
      'app/bower_components/angular-i18n/angular-locale_en-us.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap.js',
      'app/bower_components/angular-easyfb/angular-easyfb.js',
      'app/bower_components/underscore/underscore.js',
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/restangular/dist/restangular.js',
      'app/bower_components/AngularGM/angular-gm.js',
      'app/bower_components/toastr/toastr.js',
      'app/angular-seo.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/client/mock/**/*.js',
      'test/client/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
