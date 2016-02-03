/// <reference path="../typings/jasmine/jasmine.d.ts" />

// declare var MockAjax;
// var MockAjax = require('/Users/overflow/Sites/howerest/sdkizer/src-js/spec/lib/mock-ajax.js');

// console.log('MockAjax: ', MockAjax);

describe('Modularizer', () => {
  describe('.constructor', () => {

  });

  describe('.defineModule', () => {
    describe('when the environment is a browser', () => {
      describe('when Angular.js is defined', () => {
        xit('it should wrap Sdkzer into an Angular.js module', () => {

        });
      });

      describe('when Require.js is defined', () => {
        xit('it should wrap Sdkzer into a Require.js module', () => {

        });
      });

      describe('when Require.js is defined', () => {
        xit('it should append Sdkzer to window object', () => {

        });
      });
    });

    describe('when the environment is Node.js', () => {
      xit('it should append Sdkzer to global object', () => {

      });
    });
  });
});
