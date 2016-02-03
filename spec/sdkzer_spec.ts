/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../typings/jasmine-ajax/jasmine-ajax.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />
/// <reference path="../src/howerest.sdkzer.ts" />

// declare var MockAjax;
// var MockAjax = require('/Users/overflow/Sites/howerest/sdkizer/src-js/spec/lib/mock-ajax.js');

// console.log('MockAjax: ', MockAjax);

describe('Sdkzer', () => {

  var defaultAttributes;
  var initialAttributes;

  beforeEach(() => {
    jasmine.Ajax.install();

    defaultAttributes = {
      id: 1001,
      name: "An initial item name",
      description: "A descriptive description goes here",
      items: [
        {
          title: 'Return of the dragon',
          year: 1972
        }
      ]
    };

    initialAttributes = {
      id: 2012,
      name: "A different name",
      differentItems: [
        {
          radio: 1999201.2917,
          color: 'red'
        }
      ]
    };
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });


  describe('.constructor', () => {

    it("should not initialize with a defined id", () => {
      var sdkzer = new Sdkzer();
      expect(sdkzer.attrs['id']).toEqual(null);
    });

    it("should not have any attribute defined", () => {
      var sdkzer = new Sdkzer();
      expect(Object.keys(sdkzer.attrs).length).toEqual(1);
    });

    describe('when default attributes are setted', () => {
      beforeEach(() => {
        spyOn(Sdkzer.prototype, "defaults").and.returnValue(defaultAttributes);
      });

      it('should set the default attributes', () => {
        var sdkzer = new Sdkzer();
        expect(sdkzer.attrs).toEqual(defaultAttributes);
      });

      describe('when initialization attributes are setted', () => {
        var sdkzer;

        beforeEach(() => {
          sdkzer = new Sdkzer(initialAttributes)
        });

        it('should override the default attributes', () => {
          expect(sdkzer.attrs).toEqual({
            id: 2012,
            name: "A different name",
            description: "A descriptive description goes here",
            items: [
              {
                title: 'Return of the dragon',
                year: 1972
              }
            ],
            differentItems: [
              {
                radio: 1999201.2917,
                color: 'red'
              }
            ]
          });
        });
      });
    });
  });

  describe('.configure', () => {
    xit('should configure Sdkzer', () => {

    });
  });



  describe('.setDefaults', () => {
    it('should update the attributes with the default attributes', () => {
      spyOn(Sdkzer.prototype, "defaults").and.returnValue(defaultAttributes);
      var sdkzer = new Sdkzer({ name: 'Chuck Norris' });
      // Defaults should be overriten
      sdkzer.setDefaults();
      expect(sdkzer.attrs).toEqual(defaultAttributes);
    });
  });


  describe('.defaults', () => {
    it('shouldnt have defaults', () => {
      var sdkzer = new Sdkzer({});
      expect(sdkzer.defaults()).toEqual({});
    });
  });

  describe('.attr', () => {
    var sdkzer = new Sdkzer({ pos: 1999 });

    describe('when a value is not specified', () => {
      it('should read the attribute value', () => {
        expect(sdkzer.attr("pos")).toEqual(1999);
      });
    });

    describe('when a value as second parameter is specified', () => {
      it("should set the value for the attribute name specified in the first parameter", () => {
        sdkzer.attr('pos', 2000);
        expect(sdkzer.attrs['pos']).toEqual(2000);
      });
    });
  });

  describe('.resourceEndpoint', () => {
    it('shouldnt have an empty default resource endpoint defined', () => {
      var sdkzer = new Sdkzer({});
      expect(sdkzer.resourceEndpoint()).toEqual('');
    });
  });


  describe('.isNew', () => {
    it("should check if the record exists in the origin", () => {
      var sdkzer = new Sdkzer();
      expect(sdkzer.isNew()).toEqual(true);
      sdkzer.attrs['id'] = 1;
      expect(sdkzer.isNew()).toEqual(false);
    });
  });


  describe('.hasChanged', () => {
    it("should check if the record attributes has changed from the origin", () => {
      var sdkzer = new Sdkzer({ id: 1 });
      expect(sdkzer.hasChanged()).toEqual(false);
      sdkzer.pAttrs = { name: 'Previous name' };
      sdkzer.attrs = { name: 'New name' };
      expect(sdkzer.hasChanged()).toEqual(true);
    });
  });


  describe('.hasAttrChanged', () => {
    it("should check if the record has any specific attribute that differs from the origin", () => {
      var sdkzer = new Sdkzer();
      sdkzer['pAttrs'] = { name: 'First Name' };
      sdkzer.attrs = { name: 'First Name' };
      expect(sdkzer.hasAttrChanged('name')).toEqual(false);
      sdkzer.attrs['name'] = 'Oh yes';
      expect(sdkzer.hasAttrChanged('name')).toEqual(true);
    });
  });


  describe('.changedAttrs', () => {
    it("should retrieve a list of attributes different from the origin", () => {
      var sdkzer = new Sdkzer();
      expect(sdkzer.changedAttrs()).toEqual([]);
      sdkzer.attrs['age'] = 29;
      sdkzer.pAttrs = {
        age: null
      };
      expect(sdkzer.changedAttrs()).toEqual(['age']);
    });
  });


  describe('.prevAttrs', () => {
    it("should retrieve a list of the previous values for the attributes changed from the origin", () => {
      var sdkzer = new Sdkzer({
        name: 'My initial name'
      });
      sdkzer['pAttrs'] = { name: 'My initial name' }; // This is like a sync with origin
      expect(sdkzer.prevAttrs()).toEqual({});
      sdkzer.attrs = {
        name: "My New Name",
        age: 101
      };
      expect(sdkzer.prevAttrs()).toEqual({
        name: "My initial name",
        age: null
      });
    });
  });


  describe('.previousValue', () => {
    xit("should retrieve the previous attribute value before last sync from origin", () => {
      var sdkzer = new Sdkzer({
        name: 'My initial name'
      });
      // TODO: mock different attributes using jasmine ajax
      // TODO: sdkzer.fetch();
      expect(sdkzer.previousValue('name')).toEqual('My initial name');
    });
  });


  describe('.fetch', () => {

    var sdkzerInstance;

    describe('when the record has an id setted', () => {
      beforeEach(() => {

        class Person extends Sdkzer {
          public resourceEndpoint() {
            return 'http://api.mydomain.com/items';
          }

          public defaults() {
            return {
              name: "A good name",
              items: [1, 100, 1, 60]
            };
          }

          public parseOne(data) {
            // Parse record
            var json = {
              id: data.id,
              name: data.name,
              items: data.items
            };

            return json;
          }

          public parse(data) {
            var parsed = [];

            if (Array.isArray(data)) {
              _.each(data, function(recordData) {
                parsed.push(this.parseOne(recordData));
              });
            } else {
              parsed.push(this.parseOne(data.folder));
            }

            return parsed;
          }
        }

        sdkzerInstance = new Person({ id: 1 });
      });

      // TODO: This is not testing anything
      it('should make an HttpRequest', () => {
        spyOn(WebServices.HttpRequest.prototype, 'constructor');
        jasmine.Ajax.stubRequest('http://api.mydomain.com/items/1').andReturn({
          responseText: "{ id: 1000, name: 'Whatever Name' }"
        });

        sdkzerInstance.fetch().then(
          // Success
          (response) => {
            console.log(' -----> success!!', response);
            expect(WebServices.HttpRequest.prototype.constructor).toHaveBeenCalled();
          },
          // Fail
          (failure) => {
            console.log(' -----> fail!!', failure);
            expect(WebServices.HttpRequest.prototype.constructor).toHaveBeenCalled();
          }
        );
      });


      // TODO: This is not testing anything
      xit('should use the right HttpRequest parameters', () => {

        spyOn(WebServices.HttpRequest.prototype, 'constructor');
        sdkzerInstance.fetch().then(
          // Success
          () => {
            // should use a http restful url based on .resourceEndpoint() output
            // should use a GET http method
            expect(WebServices.HttpRequest.prototype.constructor).toHaveBeenCalledWith('a');

// endpoint: string, httpMethod: string, headers?: Object, data?: Object, qsParams?: Object)

          },
          // Fail
          () => {
            expect(WebServices.HttpRequest.prototype.constructor).toHaveBeenCalledWith('a');
          }
        );


      });

      xit("should set a property called 'syncing' during syncing with the right state", () => {
        expect(sdkzerInstance.syncing).toEqual(false);
        sdkzerInstance.fetch().then(
          () => {

          }
        );
      });

      xit('should fetch the data from the origin', () => {

      });

      xit('should update the attributes parsed from the origin', () => {

      });

      xit("should keep track of previous attributes before merging the origin attributes", () => {

      });
    });

    describe("when the record hasn't an id setted", () => {
      beforeEach(() => {
        sdkzerInstance = new Sdkzer();
      });

      it("shouldn't make any request", () => {
        spyOn(WebServices.HttpRequest, 'constructor');
        sdkzerInstance.fetch();
        expect(WebServices.HttpRequest.constructor).not.toHaveBeenCalled();
      });

      xit("shouldn't change the record attributes", () => {

      });
    });

  });


  describe('.parse', () => {
    xit("should parse the data as it comes", () => {

    });
  });


  describe('.toOriginJSON', () => {
    it("should return the record attributes as they are", () => {
      var sdkzer = new Sdkzer();
      sdkzer.attrs = {
        id: 1,
        name: "Steve Jobs"
      };
      expect(sdkzer.toOriginJSON()).toEqual({
        id: 1,
        name: "Steve Jobs"
      });
    });
  });


  describe('.toOriginXML', () => {
    xit("should return the record attributes in xml format", () => {

    });
  });


  describe('.toOrigin', () => {
    it("should retrieve the attributes in xml format when 'json' format is specified", () => {
      var sdkzer = new Sdkzer(initialAttributes);
      spyOn(Sdkzer.prototype, "toOriginJSON");
      sdkzer.toOrigin('json');
      expect(sdkzer.toOriginJSON).toHaveBeenCalled();
      expect(sdkzer.attrs).toEqual(sdkzer.toOrigin('json'));
    });

    it("should retrieve the attributes in xml format when 'xml' format is specified", () => {
      var sdkzer = new Sdkzer(initialAttributes);
      spyOn(Sdkzer.prototype, "toOriginXML");
      sdkzer.toOrigin('xml');
      expect(sdkzer.toOriginXML).toHaveBeenCalled();
      expect(sdkzer.attrs).toEqual(sdkzer.toOrigin('xml'));
    });
  });


  describe('.update', () => {
    it("should update an attribute in the attributes map", () => {

    });
  });


  describe('.destroy', () => {
    it("should destroy the record in the origin", () => {

    });
  });


  describe('#fetchIndex', () => {
    xit("should retrieve a list of records from the origin", () => {

    });

    xit("should return a promise that resolves into a list of parsed records retrieved from the origin", () => {

    });
  });


  describe('#fetchOne', () => {
    xit("should retrieve a record from the origin", () => {

    });

    xit("should set the record attributes with parsed records retrieved from the origin", () => {

    });

    xit("should return a promise that resolves into a parsed record retrieved from the origin", () => {

    });
  });

});
