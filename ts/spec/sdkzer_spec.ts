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
    which is how the developer will use Sdkzer (check fixtures.ts)
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
    var Item, itemInstance, responseJSON, responseText;

    describe('when the record has an id setted', () => {
      beforeEach(() => {
        responseJSON = {
          id: 1000,
          name: 'An age group',
          items: [{ age: 2 }, { older_than: 68 }, { older_than: 10, younger_than: 19 }]
        };
        responseText = JSON.stringify(responseJSON);

        jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items/1").andReturn({
          status: 200,
          statusText: 'HTTP/1.1 200 OK',
          contentType: 'application/json; charset=utf-8',
          responseText: responseText
        });

        Item = buildSdkzerModelEntity();
        itemInstance = new Item({ id: 1 });
      });

      it('should make an http request to the right endpoint', () => {
        itemInstance.fetch();
        var request = jasmine.Ajax.requests.mostRecent();

        expect(request.url).toEqual('http://api.mydomain.com/v1/items/1');
        expect(request.method).toEqual("GET");
      });

      it('should return a Promise', (done) => {
        var supposedPromise = itemInstance.fetch().then(() => { done() }, () => { done() }),
            responseData;

        expect(supposedPromise instanceof Promise).toBe(true);
      });

      describe('in a successful request', () => {
        // This will be successful since we have the requested mocked up

        it("should fetch data from the origin and resolve it in a Promise", () => {
          var responseData;
          itemInstance.fetch().then((response) => {
            responseData = response.data;
            expect(responseData).toEqual(responseJSON);
            done();
          });
        });

        it("should set a property called 'syncing' during syncing with the right state", (done) => {
          expect(itemInstance.syncing).toEqual(false);
          itemInstance.fetch().then(
            // Success
            () => {
              expect(itemInstance.syncing).toEqual(false);
              done();
            }
          );
          expect(itemInstance.syncing).toEqual(true);
        });

        it('should update the attributes parsed from the origin', (done) => {
          itemInstance.fetch().then((response) => {
            // The record attributes here must be the ones that came from the stubRequest
            expect(itemInstance.attrs).toEqual(responseJSON);
            done();
          });
        });

        it("should take the parsed attributes from the origin and store them as previous attributes", (done) => {
          // this.pAttrs is used to compare with this.attrs and determine the attributes that has changed
          var originalAttrs = {
            id: 1,
            name: "A good choice",
            items: [1, 100, 1, 60]
          };
          itemInstance.fetch().then(() => {
            expect(itemInstance.pAttrs).toEqual(responseJSON);
            done();
          });
        });
      });

      describe('in a failed request', () => {
        beforeEach(() => {
          jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items/1").andReturn({
            status: 404,
            statusText: 'HTTP/1.1 200 OK',
            contentType: 'application/json; charset=utf-8'
          });
        });

        // This will be successful since we have the requested mocked up
        it("should set a property called 'syncing' during syncing with the right state", (done) => {
          expect(itemInstance.syncing).toEqual(false);
          itemInstance.fetch().then(
            // Success
            () => {},
            // Fail
            () => {
              expect(itemInstance.syncing).toEqual(false);
              done();
            }
          );
          expect(itemInstance.syncing).toEqual(true);
        });
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


  describe('.$parse', () => {
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
    var Item, itemInstance, attributes, responseText;

    describe('when the record has an id setted', () => {
      beforeEach(() => {
        // Since we are not testing backend http API, both attributes and response match
        attributes = {
          id: 999,
          name: 'An age group',
          items: [{ age: 2 }, { older_than: 68 }, { older_than: 10, younger_than: 19 }]
        };
        responseText = JSON.stringify(attributes);
          jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items/999", null, "PUT").andReturn({
          status: 200,
          statusText: 'HTTP/1.1 200 OK',
          responseText: responseText,
          contentType: 'application/json; charset=utf-8'
        });

        Item = buildSdkzerModelEntity();
        itemInstance = new Item(attributes);
      });

      it("should update the attributes in the origin using the local attributes and using the default restful_crud http pattern", (done) => {
        itemInstance.update().then(() => {
          var request = jasmine.Ajax.requests.mostRecent();
          expect(request.url).toEqual('http://api.mydomain.com/v1/items/999');
          expect(request.method).toEqual("PUT");
          expect(request.data()).toEqual(attributes);
          done();
        }, (error) => {
          console.log('error! ', error);
          done();
        });
      });
    });
  });


  describe('.destroy', () => {
    var Item, itemInstance;

    beforeEach(() => {
        jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items/9771", null, "DELETE").andReturn({
        status: 200,
        statusText: 'HTTP/1.1 200 OK',
        contentType: 'application/json; charset=utf-8'
      });

      Item = buildSdkzerModelEntity();
      itemInstance = new Item({ id : 9771 });
    });

    it("should destroy the record in the origin using the default 'restful_crud' HTTP_PATTERN", (done) => {
      itemInstance.destroy().then((response) => {
        var request = jasmine.Ajax.requests.mostRecent();
        expect(request.method).toEqual('DELETE');
        expect(request.url).toEqual("http://api.mydomain.com/v1/items/9771");
        done();
      }, (error) => {
        done();
      });
    });

  });


  describe('#fetchIndex', () => {
    var Item, responseText, responseJSON;
    beforeEach(() => {
      responseJSON = [
        { id: 1, name: "Event 1" },
        { id: 9, name: "Event 2" },
        { id: 11, name: "Event 3" }
      ];
      responseText = JSON.stringify(responseJSON);

      jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items").andReturn({
        status: 200,
        statusText: 'HTTP/1.1 200 OK',
        contentType: 'application/json; charset=utf-8',
        responseText: responseText
      });

      Item = buildSdkzerModelEntity();
    });

    it('should make an http request to the right endpoint', (done) => {
      Item = buildSdkzerModelEntity();
      Item.fetchIndex().then(() => { done() }, () => { done() })
      var request = jasmine.Ajax.requests.mostRecent();

      expect(request.url).toEqual('http://api.mydomain.com/v1/items');
      expect(request.method).toEqual("GET");
    });

    it('should return a Promise', (done) => {
      var supposedPromise = Item.fetchIndex().then(() => { done() }, () => { done() }),
          responseData;

      expect(supposedPromise instanceof Promise).toBe(true);
    });

    describe('in a successful request', () => {
      // This will be successful since we have the requested mocked up

      it("should fetch a collection of records from the origin and return a Promise resolves into an array of instances of Item", (done) => {
        // Ensure that $parse gets caller per instance too
        Item.prototype.$parse = (data) => {
          var newName = data.name;
          return {
            id: data.id,
            newNameKey: newName
          };
        };

        Item.fetchIndex().then((instances) => {
          expect(instances[0] instanceof Item).toBeTruthy();
          expect(instances[0].attrs).toEqual({ id: 1, newNameKey: "Event 1" });
          expect(instances[1] instanceof Item).toBeTruthy();
          expect(instances[1].attrs).toEqual({ id: 9, newNameKey: "Event 2" });
          expect(instances[2] instanceof Item).toBeTruthy();
          expect(instances[2].attrs).toEqual({ id: 11, newNameKey: "Event 3" });
          done();
        });
      });
    });

    describe('in a failed request', () => {
      beforeEach(() => {
        jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items").andReturn({
          status: 404,
          statusText: 'HTTP/1.1 200 OK',
          contentType: 'application/json; charset=utf-8'
        });
      });
    });
  });

  describe('#fetchOne', () => {
    var Item, responseText, responseJSON;
    beforeEach(() => {
      responseJSON = {
        id: 1010,
        name: "An awesome choice!",
        items: [24, 7, 19, 57]
      };
      responseText = JSON.stringify(responseJSON);
      jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items/1010").andReturn({
        status: 200,
        statusText: 'HTTP/1.1 200 OK',
        contentType: 'application/json; charset=utf-8',
        responseText: responseText
      });

      Item = buildSdkzerModelEntity();
    });

    it('should make an http request to the right endpoint', (done) => {
      Item = buildSdkzerModelEntity();
      Item.fetchOne(1010).then(() => { done() }, () => { done() })
      var request = jasmine.Ajax.requests.mostRecent();

      expect(request.url).toEqual('http://api.mydomain.com/v1/items/1010');
      expect(request.method).toEqual("GET");
    });

    it('should return a Promise', (done) => {
      var supposedPromise = Item.fetchOne(1010).then(() => { done() }, () => { done() }),
          responseData;

      expect(supposedPromise instanceof Promise).toBe(true);
    });

    describe('in a successful request', () => {
      // This will be successful since we have the requested mocked up

      it("should fetch a record from the origin and return a Promise resolves an instance of Item", (done) => {
        // Ensure that $parse gets caller per instance too
        Item.prototype.$parse = (data) => {
          var newName = data.name;
          return {
            id: data.id,
            newNameKey: newName,
            items: data.items
          };
        };

        Item.fetchOne(1010).then((instance) => {
          expect(instance instanceof Item).toBeTruthy();
          expect(instance.attrs).toEqual({ id: 1010, newNameKey: "An awesome choice!", items: [24, 7, 19, 57] });
          done();
        });
      });
    });

    describe('in a failed request', () => {
      beforeEach(() => {
        jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items").andReturn({
          status: 404,
          statusText: 'HTTP/1.1 200 OK',
          contentType: 'application/json; charset=utf-8'
        });
      });
    });
  });

});
