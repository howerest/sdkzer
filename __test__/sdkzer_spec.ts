/* --------------------------------------------------------------------------

    howerest 2018 - <hola@davidvalin.com> | www.howerest.com
      Apache 2.0 Licensed

    Base functionality is being tested directly through Sdkzer class.
    Model dependent functionality must be tested in the extended class from
    Sdkzer, which is how the developer will use Sdkzer (check fixtures.ts)

--------------------------------------------------------------------------- */
import { WebServices } from "js-webservices";
import { Sdkzer } from "../src/howerest.sdkzer";
import {
  buildSdkzerModelEntity, 
  SampleValidationRuleFixture,
  SampleValidationRuleFixture2,
  SampleGlobalValidationRuleFixture
} from "./fixtures";
import xmlMock from 'xhr-mock';

describe('Sdkzer', () => {
  let defaultAttributes;
  let initialAttributes;

  beforeEach(() => {
    xmlMock.setup();
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

  afterEach(() => {
    xmlMock.teardown();
  });

  describe('.constructor', () => {
    describe('without initial attributes', () => {
      test("should not initialize with a defined id", () => {
        let sdkzer = new Sdkzer();
        expect(sdkzer['attrs']['id']).toEqual(null);
      });

      test("should not have any attribute defined", () => {
        let sdkzer = new Sdkzer();
        expect(Object.keys(sdkzer['attrs']).length).toEqual(1);
      });
    });

    describe('with initial attributes defined', () => {
      let sdkzer, initialAttrs;
      beforeEach(() => {
        initialAttrs = {
          event_id: 101010,
          comments: []
        };
        sdkzer = new Sdkzer(initialAttrs);
      });

      test('should set the attributes (attr) and previous attributes (pAttrs) using the initial attributes', () => {
        initialAttrs['id'] = null;
        expect(sdkzer.attrs).toEqual(initialAttrs);
        expect(sdkzer.pAttrs).toEqual(initialAttrs);
      });

      describe('setting an id', () => {
        beforeEach(() => {
          sdkzer = new Sdkzer({ id: 1000 });
        });

        test('should keep the initial id in the resulted attributes', () => {
          expect(sdkzer.attrs['id']).toEqual(1000);
        });
      });
    });

    describe('when default attributes are setted', () => {
      beforeEach(() => {
        spyOn(Sdkzer.prototype, "defaults").and.returnValue(defaultAttributes);
      });

      test('should set the default attributes', () => {
        let sdkzer = new Sdkzer();
        expect(sdkzer['attrs']).toEqual(defaultAttributes);
      });

      describe('with initial attributes defined', () => {
        let sdkzer;

        beforeEach(() => {
          sdkzer = new Sdkzer(initialAttributes)
        });

        test('should override the default attributes', () => {
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

  /*
   * NOTE: This is not being used yet
   */
  describe('.configure', () => {
    xtest('should configure the default http headers', () => {

    });
  });

  describe('.setDefaults', () => {
    test('should update the attributes with the default attributes', () => {
      spyOn(Sdkzer.prototype, "defaults").and.returnValue(defaultAttributes);
      let sdkzer = new Sdkzer({ name: 'Chuck Norris' });
      // Defaults should be overriten
      sdkzer.setDefaults();
      expect(sdkzer['attrs']).toEqual(defaultAttributes);
    });
  });


  describe('.defaults', () => {
    test('shouldnt have defaults', () => {
      let sdkzer = new Sdkzer({});
      expect(sdkzer.defaults()).toEqual({});
    });
  });

  describe('.isValid()', () => {
    describe("when the entity has at least one invalid message in it", () => {
      let Item, itemInstance;
      beforeEach(() => {
        Item = buildSdkzerModelEntity();
        itemInstance = new Item({ id: 1 });
        itemInstance['invalidMessages'] = {
          name: ["name is invalid"],
          items: []
        };
      });

      test("should be invalid", () => {
        expect(itemInstance.isValid()).toEqual(false);
      });
    });

    describe("when the entity has not any invalid message in it", () => {
      let Item, itemInstance;
      beforeEach(() => {
        Item = buildSdkzerModelEntity();
        Item['invalidMessages'] = {
          name: [],
          items: []
        };
        itemInstance = new Item({ id: 1 });
      });

      test("should be valid", () => {
        expect(itemInstance.isValid()).toEqual(true);
      });
    });
  });

  describe(".validate()", () => {
    let Item, itemInstance;
    describe("without any ValidationRule", () => {
      beforeEach(() => {
        Item = buildSdkzerModelEntity();
        itemInstance = new Item({ id: 1 });
        itemInstance['validationRules'] = {
          name: [],
          items: []
        };
      });

      test("should not generate invalid errors", () => {
        itemInstance.validate();
        expect(itemInstance['invalidMessages']).toEqual({});
      });
    });

    describe("with ValidationRules", () => {
      describe("when at least one ValidationRule doesn't pass", () => {
        beforeEach(() => {
          Item = buildSdkzerModelEntity();
          itemInstance = new Item({ id: 1 });
          itemInstance['validationRules'] = {
            name: [new SampleValidationRuleFixture2()], // This will fail
            items: [new SampleValidationRuleFixture()]  //  This will pass
          };
        });

        test("should generate invalid error messages for every invalid attribute", () => {
          itemInstance.validate();
          expect(itemInstance['invalidMessages']).toEqual({
            name: ["Invalid message"],
            items: []
          });
        });
      });

      describe("when all ValidationRules pass", () => {
        beforeEach(() => {
          Item = buildSdkzerModelEntity();
          itemInstance = new Item({ id: 1 });
          itemInstance['validationRules'] = {
            name: [new SampleValidationRuleFixture()], // This will pass
            items: [new SampleValidationRuleFixture()]  //  This will pass
          };
        });

        describe("when the record was previously invalid", () => {
          test("should not contain invalid error messages even when the entity was previously invalid", () => {
            // Make it invalid
            itemInstance['invalidMessages'] = {
              name: ["name is invalid"],
              items: []
            };

            // Make it pass validation now
            itemInstance.validate();
            expect(itemInstance['invalidMessages']).toEqual({
              name: [],
              items: []
            });
          });
        });
      });
    });
  });

  describe('.attr', () => {
    let sdkzer;

    beforeEach(() => {
      sdkzer = new Sdkzer();
      sdkzer.attrs['pos'] = 1999;
    });

    describe('when a value is not specified', () => {
      test('should read the attribute value', () => {
        expect(sdkzer.attr("pos")).toEqual(1999);
      });

      describe('when the attribute key value uses dots notation', () => {
        beforeEach(() => {
          sdkzer.attrs['personalData'] = {};
          sdkzer.attrs['personalData']['name'] = 'Whatever Name';
        });

        test("should read the attribute by accessing to the json keys between each dot", () => {
          expect(sdkzer.attr('personalData.name')).toEqual('Whatever Name');
        });
      });
    });

    describe('when a value as second parameter is specified', () => {
      test("should set the value for the attribute name specified in the first parameter", () => {
        sdkzer.attr('pos', 2000);
        expect(sdkzer.attrs['pos']).toEqual(2000);
      });

      describe('when the attribute key value uses dots notation', () => {
        beforeEach(() => {
          sdkzer.attrs['personalData'] = {};
          sdkzer.attrs['personalData']['name'] = 'Whatever Name';
        });

        test("should set the right attribute by accessing to the json keys between each dot", () => {
          sdkzer.attr('personalData.name', 'Another Name');
          expect(sdkzer.attrs['personalData']['name']).toEqual('Another Name');
        });
      });
    });
  });

  describe('.baseEndpoint', () => {
    test('shouldnt have an empty default base endpoint defined', () => {
      let sdkzer = new Sdkzer({});
      expect(sdkzer.baseEndpoint()).toEqual(null);
    });
  });

  describe('.resourceEndpoint', () => {
    test('should have a default resourceEndpoint defined for a "restful_crud" HTTP_PATTERN', () => {
      let sdkzer = new Sdkzer();
      expect(typeof(sdkzer.resourceEndpoint)).toEqual('function');
    });
  });

  describe('.isNew', () => {
    test("should check if the record exists in the origin", () => {
      let sdkzer = new Sdkzer();
      expect(sdkzer.isNew()).toEqual(true);
      sdkzer['attrs']['id'] = 1;
      sdkzer['lastResponse'] = null;
      expect(sdkzer.isNew()).toEqual(true);
      // Since we have a lastResponse, the entity was synced
      sdkzer.lastResponse = new WebServices.HttpResponse("", {}, "");
      expect(sdkzer.isNew()).toEqual(false);
    });
  });


  describe('.hasChanged', () => {
    test("should check if the record attributes has changed from the origin", () => {
      let sdkzer = new Sdkzer({ id: 1 });
      expect(sdkzer.hasChanged()).toEqual(false);
      sdkzer['pAttrs'] = { name: 'Previous name' };
      sdkzer['attrs'] = { name: 'New name' };
      expect(sdkzer.hasChanged()).toEqual(true);
    });
  });


  describe('.hasAttrChanged', () => {
    test("should check if the record has any specific attribute that differs from the origin", () => {
      let sdkzer = new Sdkzer();
      sdkzer['pAttrs'] = { name: 'First Name' };
      sdkzer['attrs'] = { name: 'First Name' };
      expect(sdkzer.hasAttrChanged('name')).toEqual(false);
      sdkzer['attrs']['name'] = 'Oh yes';
      expect(sdkzer.hasAttrChanged('name')).toEqual(true);
    });
  });


  describe('.changedAttrs', () => {
    test("should retrieve a list of attributes different from the origin", () => {
      let sdkzer = new Sdkzer();
      expect(sdkzer.changedAttrs()).toEqual([]);
      sdkzer['attrs']['age'] = 29;
      sdkzer['pAttrs'] = {
        age: null
      };
      expect(sdkzer.changedAttrs()).toEqual(['age']);
    });
  });


  describe('.prevAttrs', () => {
    test("should retrieve a list of the previous values for the attributes changed from the origin", () => {
      let sdkzer = new Sdkzer({
        name: 'My initial name'
      });
      sdkzer['pAttrs'] = { id: null, name: 'My other name' }; // This is like a sync with origin
      expect(sdkzer.prevAttrs()).toEqual({ name: 'My other name' });
      sdkzer['attrs'] = {
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
    test("should retrieve the previous attribute value before last sync from origin", () => {
      let sdkzer = new Sdkzer({
        name: 'My initial name'
      });
      sdkzer['attrs']['name'] = "New name";
      expect(sdkzer.prevValue('name')).toEqual('My initial name');
    });
  });


  describe('.fetch', () => {
    let Item, itemInstance, responseJSON, responseText;

    describe('when the record has an id setted', () => {
      beforeEach(() => {
        responseJSON = {
          id: 1000,
          name: 'An age group',
          items: [{ age: 2 }, { older_than: 68 }, { older_than: 10, younger_than: 19 }]
        };
        responseText = JSON.stringify(responseJSON);
        Item = buildSdkzerModelEntity();
        itemInstance = new Item({ id: 1 });
      });

      describe('when not using custom HttpQuery', () => {
        test('should make an http request to the right endpoint', async () => {
          xmlMock.get('http://api.mydomain.com/v1/items/1', (req, res) => {
            expect(req.url()['host']).toEqual('api.mydomain.com');
            expect(req.url()['path']).toEqual('/v1/items/1');
            expect(req.url()['protocol']).toEqual('http');
            expect(req.method()).toEqual("GET");
            return res.status(201).body(responseText);
          });
          await itemInstance.fetch();
        });
      });

      describe('when passing a custom HttpQuery', () => {
        test("should merge the HttpQuery with the default HttpQuery", async () => {
          xmlMock.get('http://api.mydomain.com/v1/items/1', (req, res) => {
            expect(req.headers()["auth-token"]).toEqual('MyMegaScretToken');
            expect(req.url()['host']).toEqual('api.mydomain.com');
            expect(req.url()['path']).toEqual('/v1/items/1');
            expect(req.url()['protocol']).toEqual('http');
            expect(req.method()).toEqual("GET");
            return res.status(201).body(responseText);
          });
          let customHttpQuery = new WebServices.HttpQuery({
            headers: [
              new WebServices.HttpHeader({ 'auth-token': 'MyMegaScretToken' })
            ]
          });
          await itemInstance.fetch(customHttpQuery);
        });
      });

      describe('in a successful request', () => {
        // This will be successful since we have the requested mocked up
        test("should fetch data from the origin and resolve it in a Promise", async () => {
          let responseData;
          xmlMock.get('http://api.mydomain.com/v1/items/1', (req, res) => {
            return res.status(201).body(responseText);
          });
          const response = await itemInstance.fetch();
          responseData = response.data;
          expect(responseData).toEqual(responseJSON);
        });

        test("should set a property called 'syncing' during syncing with the right state", (done) => {
          expect(itemInstance.syncing).toEqual(false);
          xmlMock.get('http://api.mydomain.com/v1/items/1', (req, res) => {
            return res.status(201).body(responseText);
          });
          itemInstance.fetch().then(
            // Success
            () => {
              expect(itemInstance.syncing).toEqual(false);
              done();
            }
          );
          expect(itemInstance.syncing).toEqual(true);
        });

        test('should update the attributes parsed from the origin', async () => {
          xmlMock.get('http://api.mydomain.com/v1/items/1', (req, res) => {
            return res.status(201).body(responseText);
          });
          const response = await itemInstance.fetch();
          // The record attributes here must be the ones that came from the stubRequest
          expect(itemInstance.attrs).toEqual(responseJSON);
        });

        test("should take the parsed attributes from the origin and store them as previous attributes", async () => {
          // this.pAttrs is used to compare with this.attrs and determine the attributes that has changed
          let originalAttrs = {
            id: 1,
            name: "A good choice",
            items: [1, 100, 1, 60]
          };
          xmlMock.get('http://api.mydomain.com/v1/items/1', (req, res) => {
            return res.status(201).body(responseText);
          });
          await itemInstance.fetch();
          expect(itemInstance.pAttrs).toEqual(responseJSON);
        });
      });

      describe('in a failed request', () => {
        beforeEach(() => {
          xmlMock.get('http://api.mydomain.com/v1/items/1', (req, res) => {
            return res.status(422).body(responseText);
          });
        });

        // This will be successful since we have the requested mocked up
        test("should set a property called 'syncing' during syncing with the right state", (done) => {
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

      // xtest("shouldn't make any request", () => {
      //   spyOn(WebServices.HttpRequest, 'constructor');
      //   itemInstance.fetch();
      //   expect(WebServices.HttpRequest.constructor).not.toHaveBeenCalled();
      // });
    });
  });

  describe('.parseRecord', () => {
    let Item, itemInstance, json, expectedParsedJson;

    beforeEach(() => {
      Item = buildSdkzerModelEntity();
      itemInstance = new Item({ id: 1 });
    });

    test("should parse the data as it comes", () => {
      json = {
        id: 1001,
        name: "Bruce Lee"
      };
      expect(itemInstance.parseRecord(json)).toEqual(json);
    });

    test("should parse the data that is on a specific key when a prefix attribute is specified", () => {
      json = {
        metadata: {
          protocol: 'https',
          response_time: '60ms'
        },
        data: {
          id: 1001,
          name: "Bruce Lee"
        }
      };
      expectedParsedJson = {
        id: 1001,
        name: "Bruce Lee"
      };

      expect(itemInstance.parseRecord(json, 'data')).toEqual(expectedParsedJson);
    });
  });


  describe('.toOriginJSON', () => {
    test("should return the record attributes as they are", () => {
      let sdkzer = new Sdkzer();
      sdkzer['attrs'] = {
        id: 1,
        name: "Steve Jobs"
      };
      expect(sdkzer.toOriginJSON()).toEqual({
        id: 1,
        name: "Steve Jobs"
      });
    });
  });


  /*
   *  NOTE: This is not being used yet
   *
    describe('.toOriginXML', () => {
       xtest("should return the record attributes in xml format", () => {

      // });
    });
   */


  describe('.toOrigin', () => {
    test("should retrieve the attributes in JSON format when 'json' format is specified", () => {
      let sdkzer = new Sdkzer(initialAttributes);
      spyOn(Sdkzer.prototype, "toOriginJSON");
      sdkzer.toOrigin('json');
      expect(sdkzer.toOriginJSON).toHaveBeenCalled();
      expect(sdkzer.toOrigin('json')).toEqual(sdkzer.toOriginJSON());
    });

    test("should retrieve the attributes in xml format when 'xml' format is specified", () => {
      let sdkzer = new Sdkzer(initialAttributes);
      spyOn(Sdkzer.prototype, "toOriginXML");
      sdkzer.toOrigin('xml');
      expect(sdkzer.toOriginXML).toHaveBeenCalled();
      expect(sdkzer.toOrigin('xml')).toEqual(sdkzer.toOriginXML());
    });
  });


  describe('.save', () => {
    let Item, itemInstance, attributes, responseText;

    describe("when the record has an id setted (existing record in the origin)", () => {
      beforeEach(() => {
        // Since we are not testing backend http API, both attributes and response match
        attributes = {
          id: 999,
          name: 'An age group',
          items: [{ age: 2 }, { older_than: 68 }, { older_than: 10, younger_than: 19 }]
        };
        responseText = JSON.stringify(attributes);
        Item = buildSdkzerModelEntity();
        itemInstance = new Item(attributes);
      });

      test("should update the attributes in the origin using the local attributes and using PUT method", async () => {
        xmlMock.put('http://api.mydomain.com/v1/items/999', (req, res) => {
          expect(req.url()['host']).toEqual('api.mydomain.com');
          expect(req.url()['path']).toEqual('/v1/items/999');
          expect(req.url()['protocol']).toEqual('http');
          expect(req.body()).toEqual(responseText);
          expect(req.method()).toEqual("PUT");
          return res.status(201).body(responseText);
        });
        await itemInstance.save();
      });
    });

    describe("when the record does't have an id setted (its a new record in the origin)", () => {
      let attributes = {
        name: 'A new age group',
        items: [{ age: 2 }, { older_than: 68 }, { older_than: 10, younger_than: 19 }]
      }, responseText, Item, itemInstance;

      beforeEach(() => {
        responseText = JSON.stringify(attributes);
        Item = buildSdkzerModelEntity();
        itemInstance = new Item(attributes);
      });

      test("should create the recordin the origin using the local attributes and using POST method", async () => {
        xmlMock.post('http://api.mydomain.com/v1/items', (req, res) => {
          expect(req.url()['host']).toEqual('api.mydomain.com');
          expect(req.url()['path']).toEqual('/v1/items');
          expect(req.url()['protocol']).toEqual('http');
          expect(req.method()).toEqual("POST");
          return res.status(201).body(responseText);
        });
        await itemInstance.save();
      });

      test("should set the id attribute retrieved from the origin", async () => {
        xmlMock.post('http://api.mydomain.com/v1/items', (req, res) => {
          expect(req.url()['host']).toEqual('api.mydomain.com');
          expect(req.url()['path']).toEqual('/v1/items');
          expect(req.url()['protocol']).toEqual('http');
          expect(req.method()).toEqual("POST");
          return res.status(201).body(JSON.stringify(Object['assign']({}, attributes, { id: 10101011 })));
        });
        // NOTE: We POST without an id but http response must contain an id referencing to persisted entity
        await itemInstance.save();
        expect(itemInstance['attrs']['id']).toBe(10101011);
      });
    });
  });


  describe('.destroy', () => {
    let Item, itemInstance;

    beforeEach(() => {
      Item = buildSdkzerModelEntity();
      itemInstance = new Item({ id : 9771 });
    });

    test("should destroy the record in the origin using the default 'restful_crud' HTTP_PATTERN", async () => {
      xmlMock.delete('http://api.mydomain.com/v1/items/9771', (req, res) => {
        expect(req.method()).toEqual('DELETE');
        expect(req.url()['host']).toEqual('api.mydomain.com');
        expect(req.url()['path']).toEqual('/v1/items/9771');
        expect(req.url()['protocol']).toEqual('http');
        return res.status(200);
      });
      await itemInstance.destroy();
    });

  });


  describe('#fetchIndex', () => {
    let Item, responseText, responseJSON;
    beforeEach(() => {
      responseJSON = [
        { id: 1, name: "Event 1" },
        { id: 9, name: "Event 2" },
        { id: 11, name: "Event 3" }
      ];
      responseText = JSON.stringify(responseJSON);
      Item = buildSdkzerModelEntity();
    });

    describe('when not using custom HttpQuery', () => {
      test('should make an http request to the right endpoint', async () => {
        Item = buildSdkzerModelEntity();
        xmlMock.get('http://api.mydomain.com/v1/items', (req, res) => {
          expect(req.url()['host']).toEqual('api.mydomain.com');
          expect(req.url()['path']).toEqual('/v1/items');
          expect(req.url()['protocol']).toEqual('http');
          expect(req.method()).toEqual("GET");
          return res.status(200);
        });
        await Item.fetchIndex();
      });
    });

    describe('when passing a custom HttpQuery', () => {
      test("should merge the HttpQuery with the default HttpQuery", async () => {
        Item = buildSdkzerModelEntity();
        let customHttpQuery = new WebServices.HttpQuery({
          headers: [
            new WebServices.HttpHeader({ 'auth-token': 'MyMegaScretToken' })
          ]
        });
        xmlMock.get('http://api.mydomain.com/v1/items', (req, res) => {
          expect(req.url()['host']).toEqual('api.mydomain.com');
          expect(req.url()['path']).toEqual('/v1/items');
          expect(req.url()['protocol']).toEqual('http');
          expect(req.method()).toEqual("GET");
          return res.status(200).body(responseText);
        });
        await Item.fetchIndex(customHttpQuery);
      });
    });

    describe('in a successful request', () => {
      // This will be successful since we have the requested mocked up
      test("should fetch a collection of records from the origin and return a Promise resolves into an array of instances of Item", async () => {
        xmlMock.get('http://api.mydomain.com/v1/items', (req, res) => {
          return res.status(200).body(responseText);
        });
        const instances = await Item.fetchIndex();
        expect(instances[0] instanceof Item).toBeTruthy();
        expect(instances[0].attrs).toEqual({ id: 1, name: "Event 1" });
        expect(instances[1] instanceof Item).toBeTruthy();
        expect(instances[1].attrs).toEqual({ id: 9, name: "Event 2" });
        expect(instances[2] instanceof Item).toBeTruthy();
        expect(instances[2].attrs).toEqual({ id: 11, name: "Event 3" });
      });
    });

    describe('in a failed request', () => {
      beforeEach(() => {
        xmlMock.get('http://api.mydomain.com/v1/items', (req, res) => {
          return res.status(404);
        });
      });
    });
  });

  describe('#fetchOne', () => {
    let Item, responseText, responseJSON;
    beforeEach(() => {
      responseJSON = {
        id: 1010,
        name: "An awesome choice!",
        items: [24, 7, 19, 57]
      };
      responseText = JSON.stringify(responseJSON);
      Item = buildSdkzerModelEntity();
    });

    describe('when not using custom HttpQuery', () => {
      test('should make an http request to the right endpoint', async () => {
        Item = buildSdkzerModelEntity();
        xmlMock.get('http://api.mydomain.com/v1/items/1010', (req, res) => {
          expect(req.url()['host']).toEqual('api.mydomain.com');
          expect(req.url()['path']).toEqual('/v1/items/1010');
          expect(req.url()['protocol']).toEqual('http');
          expect(req.method()).toEqual("GET");
          return res.status(200).body(responseText);
        });
        await Item.fetchOne(1010);
      });
    });

    describe('when passing a custom HttpQuery', () => {
      test("should merge the HttpQuery with the default HttpQuery", async () => {
        let customHttpQuery = new WebServices.HttpQuery({
          headers: [
            new WebServices.HttpHeader({ 'auth-token': 'MyMegaScretToken' })
          ]
        });
        xmlMock.get('http://api.mydomain.com/v1/items/1010', (req, res) => {
          expect(req.headers()['auth-token']).toEqual('MyMegaScretToken');
          expect(req.url()['host']).toEqual('api.mydomain.com');
          expect(req.url()['path']).toEqual('/v1/items/1010');
          expect(req.url()['protocol']).toEqual('http');
          expect(req.method()).toEqual("GET");
          return res.status(200).body(JSON.stringify(responseText));
        });
        await Item.fetchOne(1010, customHttpQuery);
      });
    });

    describe('in a successful request', () => {
      // This will be successful since we have the requested mocked up

      test("should fetch a record from the origin and return a Promise resolves an instance of Item", async () => {
        // Ensure that parseRecord gets called per instance too
        Item.prototype.parseRecord = (data) => {
          let newName = data.name;
          return {
            id: data.id,
            newNameKey: newName,
            items: data.items
          };
        };

        xmlMock.get('http://api.mydomain.com/v1/items/1010', (req, res) => {
          return res.status(200).body(responseText);
        });

        const instance = await Item.fetchOne(1010);
        //expect(instance instanceof Item).toBeTruthy();
        expect(instance.attrs).toEqual({
          id: 1010,
          newNameKey: "An awesome choice!",
          items: [24, 7, 19, 57]
        });
      });
    });

    describe('in a failed request', () => {
      beforeEach(() => {
        xmlMock.get('http://api.mydomain.com/v1/items/1010', (req, res) => {
          expect(req.url()['host']).toEqual('api.mydomain.com');
          expect(req.url()['path']).toEqual('/v1/items/1010');
          expect(req.url()['protocol']).toEqual('http');
          return res.status(404);
        });
      });

      test("it should resolve into an error", (done) => {
        const instance = Item.fetchOne(1010).then(
          () => {},
          (error) => {
            expect(error).toEqual(error);
            done();
          }
        );
      });
    });
  });

});
