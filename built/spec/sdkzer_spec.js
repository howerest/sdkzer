/* --------------------------------------------------------------------------

    howerest 2016 - <davidvalin@howerest.com> | www.howerest.com
      Apache 2.0 Licensed

    Base functionality is being tested directly through Sdkzer class.
    Model dependent functionality must be tested in the extended class from
    Sdkzer, which is how the developer will use Sdkzer (check fixtures.ts)

--------------------------------------------------------------------------- */
"use strict";
/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />
/// <reference path="../../node_modules/@types/jasmine-ajax/index.d.ts" />
/// <reference path="../../node_modules/@types/es6-promise/index.d.ts" />
var js_webservices_1 = require("js-webservices");
var howerest_sdkzer_1 = require("../howerest.sdkzer");
var fixtures_1 = require("./fixtures");
describe('Sdkzer', function () {
    var defaultAttributes;
    var initialAttributes;
    beforeEach(function () {
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
    afterEach(function () {
        jasmine.Ajax.uninstall();
    });
    describe('.constructor', function () {
        describe('without initial attributes', function () {
            it("should not initialize with a defined id", function () {
                var sdkzer = new howerest_sdkzer_1.Sdkzer();
                expect(sdkzer['attrs']['id']).toEqual(null);
            });
            it("should not have any attribute defined", function () {
                var sdkzer = new howerest_sdkzer_1.Sdkzer();
                expect(Object.keys(sdkzer['attrs']).length).toEqual(1);
            });
        });
        describe('with initial attributes defined', function () {
            var sdkzer, initialAttrs;
            beforeEach(function () {
                initialAttrs = {
                    event_id: 101010,
                    comments: []
                };
                sdkzer = new howerest_sdkzer_1.Sdkzer(initialAttrs);
            });
            it('should set the attributes (attr) and previous attributes (pAttrs) using the initial attributes', function () {
                initialAttrs['id'] = null;
                expect(sdkzer.attrs).toEqual(initialAttrs);
                expect(sdkzer.pAttrs).toEqual(initialAttrs);
            });
            describe('setting an id', function () {
                beforeEach(function () {
                    sdkzer = new howerest_sdkzer_1.Sdkzer({ id: 1000 });
                });
                it('should keep the initial id in the resulted attributes', function () {
                    expect(sdkzer.attrs['id']).toEqual(1000);
                });
            });
        });
        describe('when default attributes are setted', function () {
            beforeEach(function () {
                spyOn(howerest_sdkzer_1.Sdkzer.prototype, "defaults").and.returnValue(defaultAttributes);
            });
            it('should set the default attributes', function () {
                var sdkzer = new howerest_sdkzer_1.Sdkzer();
                expect(sdkzer['attrs']).toEqual(defaultAttributes);
            });
            describe('with initial attributes defined', function () {
                var sdkzer;
                beforeEach(function () {
                    sdkzer = new howerest_sdkzer_1.Sdkzer(initialAttributes);
                });
                it('should override the default attributes', function () {
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
     *
      describe('.configure', () => {
        it('should configure Sdkzer', () => {
  
        });
      });
    */
    describe('.setDefaults', function () {
        it('should update the attributes with the default attributes', function () {
            spyOn(howerest_sdkzer_1.Sdkzer.prototype, "defaults").and.returnValue(defaultAttributes);
            var sdkzer = new howerest_sdkzer_1.Sdkzer({ name: 'Chuck Norris' });
            // Defaults should be overriten
            sdkzer.setDefaults();
            expect(sdkzer['attrs']).toEqual(defaultAttributes);
        });
    });
    describe('.defaults', function () {
        it('shouldnt have defaults', function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer({});
            expect(sdkzer.defaults()).toEqual({});
        });
    });
    describe('.attr', function () {
        var sdkzer;
        beforeEach(function () {
            sdkzer = new howerest_sdkzer_1.Sdkzer();
            sdkzer.attrs['pos'] = 1999;
        });
        describe('when a value is not specified', function () {
            it('should read the attribute value', function () {
                expect(sdkzer.attr("pos")).toEqual(1999);
            });
            describe('when the attribute key value uses dots notation', function () {
                beforeEach(function () {
                    sdkzer.attrs['personalData'] = {};
                    sdkzer.attrs['personalData']['name'] = 'Whatever Name';
                });
                it("should read the attribute by accessing to the json keys between each dot", function () {
                    expect(sdkzer.attr('personalData.name')).toEqual('Whatever Name');
                });
            });
        });
        describe('when a value as second parameter is specified', function () {
            it("should set the value for the attribute name specified in the first parameter", function () {
                sdkzer.attr('pos', 2000);
                expect(sdkzer.attrs['pos']).toEqual(2000);
            });
            describe('when the attribute key value uses dots notation', function () {
                beforeEach(function () {
                    sdkzer.attrs['personalData'] = {};
                    sdkzer.attrs['personalData']['name'] = 'Whatever Name';
                });
                it("should set the right attribute by accessing to the json keys between each dot", function () {
                    sdkzer.attr('personalData.name', 'Another Name');
                    expect(sdkzer.attrs['personalData']['name']).toEqual('Another Name');
                });
            });
        });
    });
    describe('.baseEndpoint', function () {
        it('shouldnt have an empty default base endpoint defined', function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer({});
            expect(sdkzer.baseEndpoint()).toEqual(null);
        });
    });
    describe('.resourceEndpoint', function () {
        it('should have a default resourceEndpoint defined for a "restful_crud" HTTP_PATTERN', function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer();
            expect(typeof (sdkzer.resourceEndpoint)).toEqual('function');
        });
    });
    describe('.isNew', function () {
        it("should check if the record exists in the origin", function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer();
            expect(sdkzer.isNew()).toEqual(true);
            sdkzer['attrs']['id'] = 1;
            sdkzer['lastResponse'] = null;
            expect(sdkzer.isNew()).toEqual(true);
            // Since we have a lastResponse, the entity was synced
            sdkzer.lastResponse = new js_webservices_1.WebServices.HttpResponse("", {}, "");
            expect(sdkzer.isNew()).toEqual(false);
        });
    });
    describe('.hasChanged', function () {
        it("should check if the record attributes has changed from the origin", function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer({ id: 1 });
            expect(sdkzer.hasChanged()).toEqual(false);
            sdkzer['pAttrs'] = { name: 'Previous name' };
            sdkzer['attrs'] = { name: 'New name' };
            expect(sdkzer.hasChanged()).toEqual(true);
        });
    });
    describe('.hasAttrChanged', function () {
        it("should check if the record has any specific attribute that differs from the origin", function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer();
            sdkzer['pAttrs'] = { name: 'First Name' };
            sdkzer['attrs'] = { name: 'First Name' };
            expect(sdkzer.hasAttrChanged('name')).toEqual(false);
            sdkzer['attrs']['name'] = 'Oh yes';
            expect(sdkzer.hasAttrChanged('name')).toEqual(true);
        });
    });
    describe('.changedAttrs', function () {
        it("should retrieve a list of attributes different from the origin", function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer();
            expect(sdkzer.changedAttrs()).toEqual([]);
            sdkzer['attrs']['age'] = 29;
            sdkzer['pAttrs'] = {
                age: null
            };
            expect(sdkzer.changedAttrs()).toEqual(['age']);
        });
    });
    describe('.prevAttrs', function () {
        it("should retrieve a list of the previous values for the attributes changed from the origin", function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer({
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
    describe('.prevValue', function () {
        it("should retrieve the previous attribute value before last sync from origin", function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer({
                name: 'My initial name'
            });
            sdkzer['attrs']['name'] = "New name";
            expect(sdkzer.prevValue('name')).toEqual('My initial name');
        });
    });
    describe('.fetch', function () {
        var Item, itemInstance, responseJSON, responseText;
        describe('when the record has an id setted', function () {
            beforeEach(function () {
                responseJSON = {
                    id: 1000,
                    name: 'An age group',
                    items: [{ age: 2 }, { older_than: 68 }, { older_than: 10, younger_than: 19 }]
                };
                responseText = JSON.stringify(responseJSON);
                jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items/1").andReturn({
                    status: 200,
                    // statusText: 'HTTP/1.1 200 OK',
                    contentType: 'application/json; charset=utf-8',
                    responseText: responseText
                });
                Item = fixtures_1.buildSdkzerModelEntity();
                itemInstance = new Item({ id: 1 });
            });
            describe('when not using custom HttpQuery', function () {
                it('should make an http request to the right endpoint', function () {
                    itemInstance.fetch();
                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toEqual('http://api.mydomain.com/v1/items/1');
                    expect(request.method).toEqual("GET");
                });
            });
            describe('when passing a custom HttpQuery', function () {
                it("should merge the HttpQuery with the default HttpQuery", function () {
                    var customHttpQuery = new js_webservices_1.WebServices.HttpQuery({ headers: [new js_webservices_1.WebServices.HttpHeader({ 'Auth-Token': 'MyMegaScretToken' })] });
                    itemInstance.fetch(customHttpQuery);
                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.requestHeaders['Auth-Token']).toEqual('MyMegaScretToken');
                    expect(request.url).toEqual('http://api.mydomain.com/v1/items/1');
                    expect(request.method).toEqual("GET");
                });
            });
            describe('in a successful request', function () {
                // This will be successful since we have the requested mocked up
                it("should fetch data from the origin and resolve it in a Promise", function (done) {
                    var responseData;
                    itemInstance.fetch().then(function (response) {
                        responseData = response.data;
                        expect(responseData).toEqual(responseJSON);
                        done();
                    });
                });
                it("should set a property called 'syncing' during syncing with the right state", function (done) {
                    expect(itemInstance.syncing).toEqual(false);
                    itemInstance.fetch().then(
                    // Success
                    function () {
                        expect(itemInstance.syncing).toEqual(false);
                        done();
                    });
                    expect(itemInstance.syncing).toEqual(true);
                });
                it('should update the attributes parsed from the origin', function (done) {
                    itemInstance.fetch().then(function (response) {
                        // The record attributes here must be the ones that came from the stubRequest
                        expect(itemInstance.attrs).toEqual(responseJSON);
                        done();
                    });
                });
                it("should take the parsed attributes from the origin and store them as previous attributes", function (done) {
                    // this.pAttrs is used to compare with this.attrs and determine the attributes that has changed
                    var originalAttrs = {
                        id: 1,
                        name: "A good choice",
                        items: [1, 100, 1, 60]
                    };
                    itemInstance.fetch().then(function () {
                        expect(itemInstance.pAttrs).toEqual(responseJSON);
                        done();
                    });
                });
            });
            describe('in a failed request', function () {
                beforeEach(function () {
                    jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items/1").andReturn({
                        status: 404,
                        // statusText: 'HTTP/1.1 200 OK',
                        contentType: 'application/json; charset=utf-8'
                    });
                });
                // This will be successful since we have the requested mocked up
                it("should set a property called 'syncing' during syncing with the right state", function (done) {
                    expect(itemInstance.syncing).toEqual(false);
                    itemInstance.fetch().then(
                    // Success
                    function () { }, 
                    // Fail
                    function () {
                        expect(itemInstance.syncing).toEqual(false);
                        done();
                    });
                    expect(itemInstance.syncing).toEqual(true);
                });
            });
        });
        describe("when the record hasn't an id setted", function () {
            beforeEach(function () {
                itemInstance = new howerest_sdkzer_1.Sdkzer();
            });
            it("shouldn't make any request", function () {
                spyOn(js_webservices_1.WebServices.HttpRequest, 'constructor');
                itemInstance.fetch();
                expect(js_webservices_1.WebServices.HttpRequest.constructor).not.toHaveBeenCalled();
            });
        });
    });
    describe('.$parse', function () {
        var Item, itemInstance, json, expectedParsedJson;
        beforeEach(function () {
            Item = fixtures_1.buildSdkzerModelEntity();
            itemInstance = new Item({ id: 1 });
        });
        it("should parse the data as it comes", function () {
            json = {
                id: 1001,
                name: "Bruce Lee"
            };
            expect(itemInstance.$parse(json)).toEqual(json);
        });
        it("should parse the data that is on a specific key when a prefix attribute is specified", function () {
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
            expect(itemInstance.$parse(json, 'data')).toEqual(expectedParsedJson);
        });
    });
    describe('.toOriginJSON', function () {
        it("should return the record attributes as they are", function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer();
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
         xit("should return the record attributes in xml format", () => {
  
        // });
      });
     */
    describe('.toOrigin', function () {
        it("should retrieve the attributes in xml format when 'json' format is specified", function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer(initialAttributes);
            spyOn(howerest_sdkzer_1.Sdkzer.prototype, "toOriginJSON");
            sdkzer.toOrigin('json');
            expect(sdkzer.toOriginJSON).toHaveBeenCalled();
            expect(sdkzer['attrs']).toEqual(sdkzer.toOrigin('json'));
        });
        it("should retrieve the attributes in xml format when 'xml' format is specified", function () {
            var sdkzer = new howerest_sdkzer_1.Sdkzer(initialAttributes);
            spyOn(howerest_sdkzer_1.Sdkzer.prototype, "toOriginXML");
            sdkzer.toOrigin('xml');
            expect(sdkzer.toOriginXML).toHaveBeenCalled();
            expect(sdkzer['attrs']).toEqual(sdkzer.toOrigin('xml'));
        });
    });
    describe('.update', function () {
        var Item, itemInstance, attributes, responseText;
        describe('when the record has an id setted', function () {
            beforeEach(function () {
                // Since we are not testing backend http API, both attributes and response match
                attributes = {
                    id: 999,
                    name: 'An age group',
                    items: [{ age: 2 }, { older_than: 68 }, { older_than: 10, younger_than: 19 }]
                };
                responseText = JSON.stringify(attributes);
                jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items/999", null, "PUT").andReturn({
                    status: 200,
                    // statusText: 'HTTP/1.1 200 OK',
                    responseText: responseText,
                    contentType: 'application/json; charset=utf-8'
                });
                Item = fixtures_1.buildSdkzerModelEntity();
                itemInstance = new Item(attributes);
            });
            it("should update the attributes in the origin using the local attributes and using the default restful_crud http pattern", function (done) {
                itemInstance.update().then(function () {
                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toEqual('http://api.mydomain.com/v1/items/999');
                    expect(request.method).toEqual("PUT");
                    // expect(request.data.toEqual(attributes);
                    done();
                }, function (error) {
                    console.log('error! ', error);
                    done();
                });
            });
        });
    });
    describe('.destroy', function () {
        var Item, itemInstance;
        beforeEach(function () {
            jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items/9771", null, "DELETE").andReturn({
                status: 200,
                // statusText: 'HTTP/1.1 200 OK',
                contentType: 'application/json; charset=utf-8'
            });
            Item = fixtures_1.buildSdkzerModelEntity();
            itemInstance = new Item({ id: 9771 });
        });
        it("should destroy the record in the origin using the default 'restful_crud' HTTP_PATTERN", function (done) {
            itemInstance.destroy().then(function (response) {
                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.method).toEqual('DELETE');
                expect(request.url).toEqual("http://api.mydomain.com/v1/items/9771");
                done();
            }, function (error) {
                done();
            });
        });
    });
    describe('#fetchIndex', function () {
        var Item, responseText, responseJSON;
        beforeEach(function () {
            responseJSON = [
                { id: 1, name: "Event 1" },
                { id: 9, name: "Event 2" },
                { id: 11, name: "Event 3" }
            ];
            responseText = JSON.stringify(responseJSON);
            jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items").andReturn({
                status: 200,
                // statusText: 'HTTP/1.1 200 OK',
                contentType: 'application/json; charset=utf-8',
                responseText: responseText
            });
            Item = fixtures_1.buildSdkzerModelEntity();
        });
        describe('when not using custom HttpQuery', function () {
            it('should make an http request to the right endpoint', function (done) {
                Item = fixtures_1.buildSdkzerModelEntity();
                Item.fetchIndex().then(function () { done(); }, function () { done(); });
                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toEqual('http://api.mydomain.com/v1/items');
                expect(request.method).toEqual("GET");
            });
        });
        describe('when passing a custom HttpQuery', function () {
            it("should merge the HttpQuery with the default HttpQuery", function (done) {
                Item = fixtures_1.buildSdkzerModelEntity();
                var customHttpQuery = new js_webservices_1.WebServices.HttpQuery({ httpMethod: 'POST' });
                Item.fetchIndex(customHttpQuery).then(function () { done(); }, function () { done(); });
                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.method).toEqual("POST");
            });
        });
        describe('in a successful request', function () {
            // This will be successful since we have the requested mocked up
            it("should fetch a collection of records from the origin and return a Promise resolves into an array of instances of Item", function (done) {
                // Ensure that $parse gets caller per instance too
                Item.prototype.$parse = function (data) {
                    var newName = data.name;
                    return {
                        id: data.id,
                        newNameKey: newName
                    };
                };
                Item.fetchIndex().then(function (instances) {
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
        describe('in a failed request', function () {
            beforeEach(function () {
                jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items").andReturn({
                    status: 404,
                    // statusText: 'HTTP/1.1 200 OK',
                    contentType: 'application/json; charset=utf-8'
                });
            });
        });
    });
    describe('#fetchOne', function () {
        var Item, responseText, responseJSON;
        beforeEach(function () {
            responseJSON = {
                id: 1010,
                name: "An awesome choice!",
                items: [24, 7, 19, 57]
            };
            responseText = JSON.stringify(responseJSON);
            jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items/1010").andReturn({
                status: 200,
                // statusText: 'HTTP/1.1 200 OK',
                contentType: 'application/json; charset=utf-8',
                responseText: responseText
            });
            Item = fixtures_1.buildSdkzerModelEntity();
        });
        describe('when not using custom HttpQuery', function () {
            it('should make an http request to the right endpoint', function (done) {
                Item = fixtures_1.buildSdkzerModelEntity();
                Item.fetchOne(1010).then(function () { done(); }, function () { done(); });
                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toEqual('http://api.mydomain.com/v1/items/1010');
                expect(request.method).toEqual("GET");
            });
        });
        describe('when passing a custom HttpQuery', function () {
            it("should merge the HttpQuery with the default HttpQuery", function (done) {
                var customHttpQuery = new js_webservices_1.WebServices.HttpQuery({ headers: [new js_webservices_1.WebServices.HttpHeader({ 'Auth-Token': 'MyMegaScretToken' })] });
                Item.fetchOne(1010, customHttpQuery).then(function () { done(); }, function () { done(); });
                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.requestHeaders['Auth-Token']).toEqual('MyMegaScretToken');
                expect(request.url).toEqual('http://api.mydomain.com/v1/items/1010');
                expect(request.method).toEqual("GET");
            });
        });
        describe('in a successful request', function () {
            // This will be successful since we have the requested mocked up
            it("should fetch a record from the origin and return a Promise resolves an instance of Item", function (done) {
                // Ensure that $parse gets caller per instance too
                Item.prototype.$parse = function (data) {
                    var newName = data.name;
                    return {
                        id: data.id,
                        newNameKey: newName,
                        items: data.items
                    };
                };
                Item.fetchOne(1010).then(function (instance) {
                    expect(instance instanceof Item).toBeTruthy();
                    expect(instance.attrs).toEqual({ id: 1010, newNameKey: "An awesome choice!", items: [24, 7, 19, 57] });
                    done();
                });
            });
        });
        describe('in a failed request', function () {
            beforeEach(function () {
                jasmine.Ajax.stubRequest("http://api.mydomain.com/v1/items").andReturn({
                    status: 404,
                    // statusText: 'HTTP/1.1 200 OK',
                    contentType: 'application/json; charset=utf-8'
                });
            });
        });
    });
});
