/* --------------------------------------------------------------------------

    howerest 2018 - <hola@davidvalin.com> | www.howerest.com
      Apache 2.0 Licensed

    Base functionality is being tested directly through Sdkzer class.
    Model dependent functionality must be tested in the extended class from
    Sdkzer, which is how the developer will use Sdkzer (check fixtures.ts)

--------------------------------------------------------------------------- */
import { IQuery, Sdkzer, SdkzerParams } from "../src/howerest.sdkzer";
import {
  buildSdkzerModelEntity,
  SampleValidationRuleFixture,
  SampleValidationRuleFixture2,
  SampleGlobalValidationRuleFixture,
  EntityFields
} from "./fixtures";

const emptyDto: EntityFields = {
  id: 123
};

describe('Sdkzer', () => {
  let defaultAttributes;
  let initialAttributes;

  beforeEach(() =>
    jest.spyOn(window, 'fetch')
  );

  afterEach(() =>
    jest.resetAllMocks()
  );

  beforeEach(() => {
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

  describe('.constructor', () => {
    describe('without providing initial attributes', () => {
      test("should not initialize with a defined id or other attributes", () => {
        const sdkzer = new Sdkzer();
        expect(sdkzer.attrs).toEqual({
          id: null
        });
      });
    });

    describe('providing initial attributes', () => {
      let sdkzer, initialAttrs;
      beforeEach(() => {
        initialAttrs = {
          event_id: 101010,
          comments: []
        };
        sdkzer = new Sdkzer(initialAttrs);
      });

      test('should set the attributes (attr) and previous attributes (pAttrs) using the initial attributes', () => {
        initialAttrs.id = null;
        expect(sdkzer.attrs).toEqual(initialAttrs);
        expect(sdkzer.pAttrs).toEqual(initialAttrs);
      });
    });

    describe('when default attributes are setted', () => {
      beforeEach(() => {
        jest.spyOn(Sdkzer.prototype, "defaults").mockReturnValue(defaultAttributes);
      });

      describe('without providing initial attributes', () => {
        test('should set the default attributes', () => {
          let sdkzer = new Sdkzer();
          expect(sdkzer.attrs).toEqual(defaultAttributes);
        });
      });

      describe('providing initial attributes', () => {
        let sdkzer;

        beforeEach(() => {
          sdkzer = new Sdkzer(initialAttributes)
        });

        test('should override the initial attributes with the default attributes', () => {
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
    test('should configure the default http headers', () => {
      expect(Sdkzer['DEFAULT_HTTP_HEADERS']).toEqual({});
      Sdkzer.configure({
        defaultHttpHeaders: {
          'auth-token': 'mysecrettoken'
        }
      });
      expect(Sdkzer['DEFAULT_HTTP_HEADERS']).toEqual({
        'auth-token': 'mysecrettoken'
      });
      // reset it for next tests
      Sdkzer['DEFAULT_HTTP_HEADERS'] = {};
    });
  });

  describe('.setDefaults', () => {
    test('should update the attributes with the default attributes', () => {
      jest.spyOn(Sdkzer.prototype, "defaults").mockReturnValue(defaultAttributes);
      const sdkzer = new Sdkzer<EntityFields>({ id: 123, name: 'Chuck Norris' });
      sdkzer.attr("name", "Another name");
      expect(sdkzer.attrs).toEqual({
        ...defaultAttributes,
        id: 123,
        name: "Another name"
      });
      // defaults should be overwritten when calling it manually
      sdkzer.setDefaults();
      expect(sdkzer.attrs).toEqual(defaultAttributes);
    });
  });

  describe('.defaults', () => {
    test('should have a defaults() function defined that returns an empty object (no default attributes)', () => {
      const sdkzer = new Sdkzer<EntityFields>(emptyDto);
      expect(sdkzer.defaults()).toEqual({});
    });
  });

  describe(".validate()", () => {
    let Item, itemInstance;

    beforeEach(() => {
      Item = buildSdkzerModelEntity();
      itemInstance = new Item({ id: 1 });
    });

    test("it should clean all invalid messages from previous validations", () => {
      itemInstance.invalidMessages = {
        name: ["beeeep! ugly name"]
      };
      itemInstance.validationRules = {};
      itemInstance.validate();
      expect(itemInstance.invalidMessages).toEqual({});
    });

    describe("without any ValidationRule", () => {
      beforeEach(() => {
        itemInstance.validationRules = {
          name: [],
          items: []
        };
      });

      test("should not generate invalid errors", () => {
        itemInstance.validate();
        expect(itemInstance.invalidMessages).toEqual({});
      });
    });

    describe("with ValidationRules", () => {
      describe("when one ValidationRule doesn't pass", () => {
        beforeEach(() => {
          itemInstance.validationRules = {
            name: [new SampleValidationRuleFixture2()], // This will fail
            items: [new SampleValidationRuleFixture()]  // This will pass
          };
        });

        test("should generate invalid error messages for the invalid attribute", () => {
          itemInstance.validate();
          expect(itemInstance.invalidMessages).toEqual({
            name: ["Invalid message"],
            items: []
          });
        });
      });

      describe("when all ValidationRules pass", () => {
        beforeEach(() => {
          itemInstance.validationRules = {
            name: [new SampleValidationRuleFixture()],  // This will pass
            items: [new SampleValidationRuleFixture()]  // This will pass
          };
        });

        describe("when the record was previously invalid", () => {
          test("should not contain invalid error messages even when the entity was previously invalid", () => {
            // make it initially invalid
            itemInstance.invalidMessages = {
              name: ["name is invalid"],
              items: []
            };

            // make it pass validation now
            itemInstance.validate();
            expect(itemInstance.invalidMessages).toEqual({
              name: [],
              items: []
            });
          });
        });
      });
    });
  });

  describe(".isValid", () => {
    test("it should be valid when there are no validation error messages", () => {
      const Item = buildSdkzerModelEntity();
      const itemInstance = new Item({ id: 1 });
      itemInstance.invalidMessages = {
        name: [],
        items: []
      };
      expect(itemInstance.isValid()).toEqual(true);
    });

    test("it should be invalid when there are no validation error messages", () => {
      const Item = buildSdkzerModelEntity();
      const itemInstance = new Item({ id: 1 });
      itemInstance.invalidMessages = {
        name: ["name is invalid"],
        items: []
      };
      expect(itemInstance.isValid()).toEqual(false);
    });
  });

  describe('.attr', () => {
    let sdkzer;

    beforeEach(() => {
      sdkzer = new Sdkzer();
      sdkzer.attrs.pos = 1999;
    });

    describe('when a value is not specified', () => {
      test('should read the attribute value based on its key', () => {
        expect(sdkzer.attr("pos")).toEqual(1999);
      });

      describe('when the attribute key value uses dots notation', () => {
        beforeEach(() => {
          sdkzer.attrs.personalData = {};
          sdkzer.attrs.personalData.name = {
            first: "David"
          };
        });

        test("should read the attribute by accessing to the json keys nested between each dot", () => {
          expect(sdkzer.attr('personalData.name.first')).toEqual('David');
        });
      });
    });

    describe('when a value as second parameter is specified', () => {
      test("should set the value for the attribute name specified in the first parameter", () => {
        sdkzer.attr('pos', 2000);
        expect(sdkzer.attrs.pos).toEqual(2000);
      });

      describe('when the attribute key value uses dots notation', () => {
        beforeEach(() => {
          sdkzer.attrs.personalData = {};
          sdkzer.attrs.personalData.name = {
            initial: "Mr."
          };
        });

        test("should set the right attribute by accessing to the json keys between each dot", () => {
          sdkzer.attr('personalData.name.initial', 'Mr.');
          expect(sdkzer.attrs.personalData.name.initial).toEqual('Mr.');
        });
      });
    });

    describe("when calling it without parameters", () => {
      test("should return all attributes of the instance", () => {
        expect(sdkzer.attr()).toEqual(sdkzer.attrs);
      });
    });
  });

  describe('.baseEndpoint', () => {
    test('shouldnt have an empty default base endpoint defined (function should exist)', () => {
      const sdkzer = new Sdkzer<EntityFields>(emptyDto);
      expect(sdkzer.baseEndpoint()).toEqual(null);
    });
  });

  describe('.resourceEndpoint', () => {
    test('should have a default resourceEndpoint defined (function should exist)', () => {
      const sdkzer = new Sdkzer();
      expect(typeof(sdkzer.resourceEndpoint)).toEqual('function');
      expect(sdkzer.resourceEndpoint()).toEqual("");
    });
  });

  describe('.isNew', () => {
    let sdkzer;

    test("should return true when there is no id in the record", () => {
      sdkzer = new Sdkzer();
      expect(sdkzer.isNew()).toEqual(true);
    });

    test("should return false when there is an id in the record", () => {
      sdkzer = new Sdkzer({ id: 2 });
      expect(sdkzer.isNew()).toEqual(false);
    });
  });

  describe('.hasChanged', () => {
    test("should return false when no attributes have changed since last sync", () => {
      const sdkzer = new Sdkzer<EntityFields>({ id: 1 });
      expect(sdkzer.hasChanged()).toEqual(false);
    });

    test("should return true when attributes have changed since last sync", () => {
      const sdkzer = new Sdkzer<EntityFields>({ id: 1 });
      sdkzer.pAttrs = { id: 123, name: 'Previous name' };
      sdkzer.attrs = { id: 123, name: 'New name' };
      expect(sdkzer.hasChanged()).toEqual(true);
    });
  });

  describe('.hasAttrChanged', () => {
    test("should return true when the attribute has changed since last sync", () => {
      let sdkzer = new Sdkzer<EntityFields>();
      sdkzer.pAttrs = { id: 123, name: 'First Name' };
      sdkzer.attrs.name = 'Oh yes';
      expect(sdkzer.hasAttrChanged('name')).toEqual(true);
    });

    test("should return false when the attribute has not been changed since last sync", () => {
      let sdkzer = new Sdkzer<EntityFields>();
      sdkzer.pAttrs = { id: 123, name: 'First Name' };
      sdkzer.attrs = { id: 123, name: 'First Name' };
      expect(sdkzer.hasAttrChanged('name')).toEqual(false);
    });
  });

  describe('.changedAttrs', () => {
    test("should retrieve a list of attributes different from the origin", () => {
      let sdkzer = new Sdkzer<EntityFields>();
      expect(sdkzer.changedAttrs()).toEqual([]);
      sdkzer.attrs = {
        id: 123,
        age: 29
      };
      sdkzer.attrs.age = 29;
      sdkzer.pAttrs = {
        id: 123,
        age: 109
      };
      expect(sdkzer.changedAttrs()).toEqual(['age']);
    });
  });

  describe('.prevAttrs', () => {
    test("should retrieve a list of the previous values for the attributes changed from the origin", () => {
      const sdkzer = new Sdkzer<EntityFields>({
        id: 123,
        name: 'My initial name'
      });
      sdkzer.pAttrs = { id: null, name: 'My other name' }; // This is like a sync with origin
      expect(sdkzer.prevAttrs()).toEqual({ id: null, name: 'My other name' });
      sdkzer.attrs = {
        id: 123,
        name: "A Special Name",
        age: 97
      };
      expect(sdkzer.prevAttrs()).toEqual({
        id: null,
        name: "My other name",
        age: null
      });
    });
  });

  describe('.prevValue', () => {
    test("should retrieve the previous attribute value before last sync from origin", () => {
      let sdkzer = new Sdkzer<EntityFields>({
        id: 123,
        name: 'My initial name'
      });
      sdkzer.attrs.name = "New name";
      expect(sdkzer.prevValue('name')).toEqual('My initial name');
    });
  });

  describe('.fetch', () => {
    let Item, itemInstance, responseJSON, responseText;

    describe('when the record has an id setted', () => {
      describe('in a successful request', () => {
        beforeEach(() => {
          responseJSON = {
            id: 1000,
            name: 'An age group',
            items: [{ age: 2 }, { older_than: 68 }, { older_than: 10, younger_than: 19 }]
          };
          responseText = JSON.stringify(responseJSON);
          Item = buildSdkzerModelEntity();
          itemInstance = new Item({ id: 1 });
          (window.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => (responseText)
          });
        });

        // This will be successful since we have the requested mocked up
        test("should fetch data from the origin and resolve it in a Promise", async () => {
          let responseData;
          const response = await itemInstance.fetch();
          responseData = JSON.parse(await response.json());
          expect(responseData).toEqual(responseJSON);
        });

        test("should set a property called 'syncing' during syncing with the right state", (done) => {
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

        test('should update the attributes parsed from the origin', async () => {
          const response = await itemInstance.fetch();
          // The record attributes here must be the ones that came from the stubRequest
          expect(itemInstance.attrs).toEqual(responseJSON);
        });

        test("should take the parsed attributes from the origin and store them as previous attributes", async () => {
          // this.pAttrs is used to compare with this.attrs and determine the attributes that has changed
          await itemInstance.fetch();
          expect(itemInstance.pAttrs).toEqual(responseJSON);
        });

        describe('when not using custom HttpQuery', () => {
          test('should make an http request to the right endpoint', async () => { 
            await itemInstance.fetch();
            expect(fetch).toHaveBeenCalledWith(
              "http://api.mydomain.com/v1/items/1",
              {
                method: "GET",
                headers: {},
                body: "[object Object]"
              }
            );
          });
        });
  
        describe('when passing a custom HttpQuery', () => {
          test("should merge the HttpQuery with the default HttpQuery", async () => {
            const customHttpQuery:IQuery = {
              headers: { 'auth-token': 'MyMegaScretToken' }
            };
            await itemInstance.fetch(customHttpQuery);
            expect(fetch).toHaveBeenCalledWith(
              "http://api.mydomain.com/v1/items/1",
              {
                method: "GET",
                headers: { "auth-token": "MyMegaScretToken" },
                body: "[object Object]"
              }
            );
          });
        });
      });

      describe('in a failed request', () => {
        beforeEach(() => {
          jest.resetAllMocks();
          (window.fetch as jest.Mock).mockRejectedValue({
            ok: false,
            status: 422,
            json: async () => (responseText)
          });
        });

        // This will be successful since we have the requested mocked up
        test("should set a property called 'syncing' during syncing with the right state", (done) => {
          expect(itemInstance.syncing).toEqual(false);
          itemInstance.fetch().then(
            // Success
            () => {
              // should not be called  
            },
            // Fail
            () => {
              expect(itemInstance.syncing).toEqual(false);
              done();
            }
          );
          expect(itemInstance.syncing).toEqual(true);
        });

        test("it should resolve into an error", (done) => {
          itemInstance.fetch().then(
            () => {},
            (error) => {
              expect(error).toEqual(error);
              done();
            }
          );
        });
      });
    });

    describe("when the record hasn't an id setted", () => {
      beforeEach(() => {
        itemInstance = new Sdkzer();
      });

      test("shouldn't make any request", () => {
        itemInstance.fetch();
        expect(fetch).not.toHaveBeenCalled();
      });
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
          offset: 0,
          limit: 25,
          count: 1,
          response_time: '60ms'
        },
        data: [
          {
            id: 1001,
            name: "Bruce Lee"
          }
        ]
      };
      expect(itemInstance.parseRecord(json, 'data')).toEqual([
        {
          id: 1001,
          name: "Bruce Lee"
        }
      ]);
    });
  });


  describe('.toOriginJSON', () => {
    describe("with the default parser", () => {
      test("should return the record attributes as they are for the origin", () => {
        const sdkzer = new Sdkzer<EntityFields>();
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

    describe("with a custom parser", () => {
      test("should parse the record attributes correctly for the origin", () => {
        const sdkzer = new Sdkzer<EntityFields>({
          id: null,
          name: "Chuck Norris",
          age: 30
        });
        Sdkzer.prototype.toOriginJSON = function() {
          return {
            id: this.attrs.id,
            full_name: this.attrs.name, // note different attribute name
            age: this.attrs.age
          };
        };
        expect(sdkzer.toOriginJSON()).toEqual({
          id: null,
          full_name: "Chuck Norris",
          age: 30
        });
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
    test("should retrieve the attributes in JSON format by default", () => {
      const sdkzer = new Sdkzer(initialAttributes);
      jest.spyOn(Sdkzer.prototype, "toOriginJSON");
      const toOriginResult = sdkzer.toOrigin();
      expect(sdkzer.toOriginJSON).toHaveBeenCalled();
      expect(toOriginResult).toEqual(sdkzer.toOriginJSON());
    });

    test("should retrieve the attributes in JSON format when 'json' format is specified", () => {
      const sdkzer = new Sdkzer(initialAttributes);
      jest.spyOn(Sdkzer.prototype, "toOriginJSON");
      const toOriginResult = sdkzer.toOrigin('json');
      expect(sdkzer.toOriginJSON).toHaveBeenCalled();
      expect(toOriginResult).toEqual(sdkzer.toOriginJSON());
    });

    test("should retrieve the attributes in xml format when 'xml' format is specified", () => {
      let sdkzer = new Sdkzer(initialAttributes);
      jest.spyOn(Sdkzer.prototype, "toOriginXML");
      const toOriginResult = sdkzer.toOrigin('xml');
      expect(sdkzer.toOriginXML).toHaveBeenCalled();
      expect(toOriginResult).toEqual(sdkzer.toOriginXML());
    });
  });

  describe('.save', () => {
    let Item, itemInstance, attributes, responseText;

    describe("in a successful request", () => {
      describe("when the record has an id setted (considered an existing record in the origin)", () => {
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
          (window.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => (responseText)
          });
        });
  
        test("should update the attributes in the origin using the local attributes and using PUT method", async () => {
          await itemInstance.save();
          expect(fetch).toHaveBeenCalledWith(
            "http://api.mydomain.com/v1/items/999",
            {
              method: "PUT",
              headers: {},
              body: "[object Object]"
            }
          );
        });
      });
  
      describe("when the record does't have an id setted (considered a new record in the origin)", () => {
        beforeEach(() => {
          attributes = {
            id: null,
            name: 'A new age group',
            items: [{ age: 2 }, { older_than: 68 }, { older_than: 10, younger_than: 19 }]
          };
          responseText = JSON.stringify(attributes);
          Item = buildSdkzerModelEntity();
          itemInstance = new Item(attributes);
          (window.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({
              ...responseText,
              id: 10101011
            })
          });
        });
  
        test("should create the record in the origin using the local attributes and using POST method", async () => {
          await itemInstance.save();
          expect(fetch).toHaveBeenCalledWith(
            "http://api.mydomain.com/v1/items",
            {
              method: "POST",
              headers: {},
              body: "[object Object]"
            }
          )
        });
  
        test("should set the id attribute retrieved from the origin", async () => {
          // NOTE: We POST without an id but the id received after sync should be
          // part of the entity
          await itemInstance.save();
          expect(itemInstance.attrs.id).toBe(10101011);
        });
      });
    });

    describe('in a failed request', () => {
      beforeEach(() => {
        (window.fetch as jest.Mock).mockRejectedValue({
          ok: false,
          status: 404,
          json: async () => ({})
        });
      });

      test("it should resolve into an error", (done) => {
        itemInstance.save().then(
          () => {},
          (error) => {
            expect(error).toEqual(error);
            done();
          }
        );
      });
    });
  });


  describe('.destroy', () => {
    let Item, itemInstance;

    beforeEach(() => {
      Item = buildSdkzerModelEntity();
      itemInstance = new Item({ id : 9771 });
    });

    test("should try to destroy the record in the origin", async () => {
      (window.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => ({})
      });
      await itemInstance.destroy();
      expect(fetch).toHaveBeenCalledWith(
        "http://api.mydomain.com/v1/items/9771",
        {
          method: "DELETE",
          headers: {},
          body: expect.objectContaining({})
        }
      );
    });

    describe('in a failed request', () => {
      beforeEach(() => {
        (window.fetch as jest.Mock).mockRejectedValue({
          ok: false,
          status: 404,
          json: async () => ({})
        });
      });

      test("it should resolve into an error", (done) => {
        itemInstance.destroy().then(
          () => {},
          (error) => {
            expect(error).toEqual(error);
            done();
          }
        );
      });
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
      (window.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => (responseText)
      });
    });

    describe('in a successful request', () => {
      describe('when not using custom HttpQuery', () => {
        test('should make an http request to the right endpoint', async () => {
          await Item.fetchIndex();
          expect(fetch).toHaveBeenCalledWith(
            "http://api.mydomain.com/v1/items",
            {
              method: "GET",
              headers: {}
            }
          );
        });
      });
  
      describe('when passing a custom HttpQuery', () => {
        test("should merge the HttpQuery with the default HttpQuery", async () => {
          const customHttpQuery:IQuery = {
            headers: { 'auth-token': 'MyMegaScretToken' },
            qsParams: { offset: 0, limit: 20 }
          };
  
          await Item.fetchIndex(customHttpQuery);
          expect(fetch).toHaveBeenCalledWith(
            "http://api.mydomain.com/v1/items?offset=0&limit=20",
            {
              method: "GET",
              headers: { 'auth-token': 'MyMegaScretToken' }
            }
          );
        });
      });

      test("should fetch a collection of records from the origin and return a Promise resolves into an array of instances of Item", async () => {
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
        (window.fetch as jest.Mock).mockRejectedValue({
          ok: false,
          status: 404,
          json: async () => ({})
        });
      });

      test("it should resolve into an error", (done) => {
        Item.fetchIndex().then(
          () => {},
          (error) => {
            expect(error).toEqual(error);
            done();
          }
        );
      });
    });
  });

  describe('#fetchOne', () => {
    let Item, responseText, responseJSON;

    describe('in a successful request', () => {
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
          (window.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => (responseText)
          });
          await Item.fetchOne(1010);
          expect(fetch).toHaveBeenCalledWith(
            "http://api.mydomain.com/v1/items/1010",
            {
              method: "GET",
              headers: {}
            }
          );
        });
      });
  
      describe('when passing a custom HttpQuery', () => {
        test("should merge the HttpQuery with the default HttpQuery", async () => {
          const customHttpQuery:IQuery = {
            headers: { 'auth-token': 'MyMegaScretToken' }
          };
          (window.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => (responseText)
          });
  
          await Item.fetchOne(1010, customHttpQuery);
          expect(fetch).toHaveBeenCalledWith(
            "http://api.mydomain.com/v1/items/1010",
            {
              method: "GET",
              headers: { "auth-token": "MyMegaScretToken" }
            }
          );
        });
      });

      test("should fetch a record from the origin and return a Promise resolves an instance of Item", async () => {
        Item.prototype.parseRecord = (data) => {
          let newName = data.name;
          return {
            id: data.id,
            newNameKey: newName,
            items: data.items
          };
        };

        (window.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => (responseText)
        });

        const instance = await Item.fetchOne(1010);
        expect(fetch).toHaveBeenCalledWith(
          "http://api.mydomain.com/v1/items/1010",
          {
            method: "GET",
            headers: {}
          }
        );
        expect(instance instanceof Item).toBeTruthy();
        expect(instance.attrs).toEqual({
          id: 1010,
          newNameKey: "An awesome choice!",
          items: [24, 7, 19, 57]
        });
      });
    });

    describe('in a failed request', () => {
      beforeEach(() => {
        (window.fetch as jest.Mock).mockRejectedValue({
          ok: false,
          status: 404,
          json: async () => ({})
        });
      });

      test("it should resolve into an error", (done) => {
        Item.fetchOne(1010).then(
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
