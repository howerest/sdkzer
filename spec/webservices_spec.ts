/// <reference path="../typings/jasmine/jasmine.d.ts" />

// declare var MockAjax;
// var MockAjax = require('/Users/overflow/Sites/howerest/sdkizer/src-js/spec/lib/mock-ajax.js');

// console.log('MockAjax: ', MockAjax);

describe('HttpRequest', () => {
  describe('.constructor', () => {
    describe("when XMLHttpRequest doesn't exist", () => {
      xit('it should require a Node.js XMLHttpRequest implementation', () => {

      });
    });

    describe('when XMLHttpRequest is not defined', () => {

    });

    describe("when XMLHttpRequest doesn't exist", () => {
      xit('shoud make a request to the endpoint', () => {

      });
      xit('shoud use the http verb specified', () => {

      });
      xit('shoud set the proper http headers', () => {

      });
      xit('shoud pass the proper query string', () => {

      });
      xit('shoud pass the proper data', () => {

      });

      xit('should return a Promise', () => {

      });
    });
  });
});


describe('HttpResponse', () => {
  describe('.constructor', () => {
    xit('shoud expose the attributes with keys camlized', () => {

    });
  });
});
