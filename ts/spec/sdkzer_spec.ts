/// <reference path="../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../typings/jasmine-ajax/jasmine-ajax.d.ts" />
/// <reference path="../../node_modules/js-webservices/ts/web_services.ts" />
/// <reference path="../../ts/howerest.sdkzer.ts" />
/// <reference path="./fixtures.ts" />

/*
    howerest 2016 - <davidvalin@howerest.com> | www.howerest.com
      Apache 2.0 Licensed

    Unit tests the critical case uses of Sdkzer.
    Base functionality is being tested directly through Sdkzer class.
    Model dependent functionality is being tested by extensing Sdkzer class,
    which is how the developer will use Sdkzer
 */

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

    describe('without initial attributes', () => {
      it("should not initialize with a defined id", () => {
        var sdkzer = new Sdkzer();
        expect(sdkzer.attrs['id']).toEqual(null);
      });

      it("should not have any attribute defined", () => {
        var sdkzer = new Sdkzer();
        expect(Object.keys(sdkzer.attrs).length).toEqual(1);
      });
    });

    describe('with initial attributes defined', () => {
      var sdkzer, initialAttrs;
      beforeEach(() => {
        initialAttrs = {
          event_id: 101010,
          comments: []
        };
        sdkzer = new Sdkzer(initialAttrs);
      });

      it('should set the attributes (attr) and previous attributes (pAttrs) using the initial attributes', () => {
        initialAttrs['id'] = null;
        expect(sdkzer.attrs).toEqual(initialAttrs);
        expect(sdkzer.pAttrs).toEqual(initialAttrs);
      });

      describe('setting an id', () => {
        beforeEach(() => {
          sdkzer = new Sdkzer({ id: 1000 });
        });

        it('should keep the initial id in the resulted attributes', () => {
          expect(sdkzer.attrs['id']).toEqual(1000);
        });
      });
    });

    describe('when default attributes are setted', () => {
      beforeEach(() => {
        spyOn(Sdkzer.prototype, "defaults").and.returnValue(defaultAttributes);
      });

      it('should set the default attributes', () => {
        var sdkzer = new Sdkzer();
        expect(sdkzer.attrs).toEqual(defaultAttributes);
      });

      describe('with initial attributes defined', () => {
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
    var sdkzer;

    beforeEach(() => {
      sdkzer = new Sdkzer();
      sdkzer.attrs['pos'] = 1999;
    });

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

  describe('.baseEndpoint', () => {
    it('shouldnt have an empty default base endpoint defined', () => {
      var sdkzer = new Sdkzer({});
      expect(sdkzer.baseEndpoint()).toEqual(null);
    });
  });

  describe('.resourceEndpoint', () => {
    xit('should have a default resourceEndpoint defined for a "restful_crud" HTTP_PATTERN', () => {

    });
  });

  describe('.isNew', () => {
    it("should check if the record exists in the origin", () => {
      var sdkzer = new Sdkzer();
      expect(sdkzer.isNew()).toEqual(true);
      sdkzer.attrs['id'] = 1;
      expect(sdkzer.isNew()).toEqual(true);
      sdkzer.lastResponse = {}; // Use HttpResponse
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
      sdkzer['pAttrs'] = { id: null, name: 'My other name' }; // This is like a sync with origin
      expect(sdkzer.prevAttrs()).toEqual({ name: 'My other name' });
      sdkzer.attrs = {
        name: "A Special Name",
        age: 97
      };
      expect(sdkzer.prevAttrs()).toEqual({
        name: "My other name",
        age: null
      });
    });
  });


  describe('.prevValue', () => {
    it("should retrieve the previous attribute value before last sync from origin", () => {
      var sdkzer = new Sdkzer({
        name: 'My initial name'
      });
      sdkzer.attrs['name'] = "New name";
      expect(sdkzer.prevValue('name')).toEqual('My initial name');
    });
  });


  describe('.fetch', () => {
    var Item, itemInstance;

    describe('when the record has an id setted', () => {
      beforeEach(() => {
        Item = buildSdkzerModelEntity();
        itemInstance = new Item({ id: 1 });
      });

      // TODO: This seems silly. Better cases?
      xit('should make an HttpRequest', () => {
        spyOn(WebServices.HttpRequest.prototype, 'constructor');
        jasmine.Ajax.stubRequest('http://api.mydomain.com/v1/items/1').andReturn({
          responseText: "{ id: 1000, name: 'Whatever Name' }"
        });

        itemInstance.fetch().then(
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
        itemInstance.fetch().then(
          // Success
          () => {
            // should use a http restful url based on .baseEndpoint() output
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
        expect(itemInstance.syncing).toEqual(false);
        itemInstance.fetch().then(
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
        itemInstance = new Sdkzer();
      });

      it("shouldn't make any request", () => {
        spyOn(WebServices.HttpRequest, 'constructor');
        itemInstance.fetch();
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
    xit("should update an attribute in the attributes map", () => {

    });
  });


  describe('.destroy', () => {
    xit("should destroy the record in the origin", () => {

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
