var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        it("should not initialize with a defined id", function () {
            var sdkzer = new Sdkzer();
            expect(sdkzer.attrs['id']).toEqual(null);
        });
        it("should not have any attribute defined", function () {
            var sdkzer = new Sdkzer();
            expect(Object.keys(sdkzer.attrs).length).toEqual(1);
        });
        describe('when default attributes are setted', function () {
            beforeEach(function () {
                spyOn(Sdkzer.prototype, "defaults").and.returnValue(defaultAttributes);
            });
            it('should set the default attributes', function () {
                var sdkzer = new Sdkzer();
                expect(sdkzer.attrs).toEqual(defaultAttributes);
            });
            describe('when initialization attributes are setted', function () {
                var sdkzer;
                beforeEach(function () {
                    sdkzer = new Sdkzer(initialAttributes);
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
    describe('.configure', function () {
        xit('should configure Sdkzer', function () {
        });
    });
    describe('.setDefaults', function () {
        it('should update the attributes with the default attributes', function () {
            spyOn(Sdkzer.prototype, "defaults").and.returnValue(defaultAttributes);
            var sdkzer = new Sdkzer({ name: 'Chuck Norris' });
            sdkzer.setDefaults();
            expect(sdkzer.attrs).toEqual(defaultAttributes);
        });
    });
    describe('.defaults', function () {
        it('shouldnt have defaults', function () {
            var sdkzer = new Sdkzer({});
            expect(sdkzer.defaults()).toEqual({});
        });
    });
    describe('.attr', function () {
        var sdkzer = new Sdkzer({ pos: 1999 });
        describe('when a value is not specified', function () {
            it('should read the attribute value', function () {
                expect(sdkzer.attr("pos")).toEqual(1999);
            });
        });
        describe('when a value as second parameter is specified', function () {
            it("should set the value for the attribute name specified in the first parameter", function () {
                sdkzer.attr('pos', 2000);
                expect(sdkzer.attrs['pos']).toEqual(2000);
            });
        });
    });
    describe('.resourceEndpoint', function () {
        it('shouldnt have an empty default resource endpoint defined', function () {
            var sdkzer = new Sdkzer({});
            expect(sdkzer.resourceEndpoint()).toEqual('');
        });
    });
    describe('.isNew', function () {
        it("should check if the record exists in the origin", function () {
            var sdkzer = new Sdkzer();
            expect(sdkzer.isNew()).toEqual(true);
            sdkzer.attrs['id'] = 1;
            expect(sdkzer.isNew()).toEqual(false);
        });
    });
    describe('.hasChanged', function () {
        it("should check if the record attributes has changed from the origin", function () {
            var sdkzer = new Sdkzer({ id: 1 });
            expect(sdkzer.hasChanged()).toEqual(false);
            sdkzer.pAttrs = { name: 'Previous name' };
            sdkzer.attrs = { name: 'New name' };
            expect(sdkzer.hasChanged()).toEqual(true);
        });
    });
    describe('.hasAttrChanged', function () {
        it("should check if the record has any specific attribute that differs from the origin", function () {
            var sdkzer = new Sdkzer();
            sdkzer['pAttrs'] = { name: 'First Name' };
            sdkzer.attrs = { name: 'First Name' };
            expect(sdkzer.hasAttrChanged('name')).toEqual(false);
            sdkzer.attrs['name'] = 'Oh yes';
            expect(sdkzer.hasAttrChanged('name')).toEqual(true);
        });
    });
    describe('.changedAttrs', function () {
        it("should retrieve a list of attributes different from the origin", function () {
            var sdkzer = new Sdkzer();
            expect(sdkzer.changedAttrs()).toEqual([]);
            sdkzer.attrs['age'] = 29;
            sdkzer.pAttrs = {
                age: null
            };
            expect(sdkzer.changedAttrs()).toEqual(['age']);
        });
    });
    describe('.prevAttrs', function () {
        it("should retrieve a list of the previous values for the attributes changed from the origin", function () {
            var sdkzer = new Sdkzer({
                name: 'My initial name'
            });
            sdkzer['pAttrs'] = { name: 'My initial name' };
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
    describe('.previousValue', function () {
        xit("should retrieve the previous attribute value before last sync from origin", function () {
            var sdkzer = new Sdkzer({
                name: 'My initial name'
            });
            expect(sdkzer.previousValue('name')).toEqual('My initial name');
        });
    });
    describe('.fetch', function () {
        var sdkzerInstance;
        describe('when the record has an id setted', function () {
            beforeEach(function () {
                var Person = (function (_super) {
                    __extends(Person, _super);
                    function Person() {
                        _super.apply(this, arguments);
                    }
                    Person.prototype.resourceEndpoint = function () {
                        return 'http://api.mydomain.com/items';
                    };
                    Person.prototype.defaults = function () {
                        return {
                            name: "A good name",
                            items: [1, 100, 1, 60]
                        };
                    };
                    Person.prototype.parseOne = function (data) {
                        var json = {
                            id: data.id,
                            name: data.name,
                            items: data.items
                        };
                        return json;
                    };
                    Person.prototype.parse = function (data) {
                        var parsed = [];
                        if (Array.isArray(data)) {
                            _.each(data, function (recordData) {
                                parsed.push(this.parseOne(recordData));
                            });
                        }
                        else {
                            parsed.push(this.parseOne(data.folder));
                        }
                        return parsed;
                    };
                    return Person;
                })(Sdkzer);
                sdkzerInstance = new Person({ id: 1 });
            });
            it('should make an HttpRequest', function () {
                spyOn(WebServices.HttpRequest.prototype, 'constructor');
                jasmine.Ajax.stubRequest('http://api.mydomain.com/items/1').andReturn({
                    responseText: "{ id: 1000, name: 'Whatever Name' }"
                });
                sdkzerInstance.fetch().then(function (response) {
                    console.log(' -----> success!!', response);
                    expect(WebServices.HttpRequest.prototype.constructor).toHaveBeenCalled();
                }, function (failure) {
                    console.log(' -----> fail!!', failure);
                    expect(WebServices.HttpRequest.prototype.constructor).toHaveBeenCalled();
                });
            });
            xit('should use the right HttpRequest parameters', function () {
                spyOn(WebServices.HttpRequest.prototype, 'constructor');
                sdkzerInstance.fetch().then(function () {
                    expect(WebServices.HttpRequest.prototype.constructor).toHaveBeenCalledWith('a');
                }, function () {
                    expect(WebServices.HttpRequest.prototype.constructor).toHaveBeenCalledWith('a');
                });
            });
            xit("should set a property called 'syncing' during syncing with the right state", function () {
                expect(sdkzerInstance.syncing).toEqual(false);
                sdkzerInstance.fetch().then(function () {
                });
            });
            xit('should fetch the data from the origin', function () {
            });
            xit('should update the attributes parsed from the origin', function () {
            });
            xit("should keep track of previous attributes before merging the origin attributes", function () {
            });
        });
        describe("when the record hasn't an id setted", function () {
            beforeEach(function () {
                sdkzerInstance = new Sdkzer();
            });
            it("shouldn't make any request", function () {
                spyOn(WebServices.HttpRequest, 'constructor');
                sdkzerInstance.fetch();
                expect(WebServices.HttpRequest.constructor).not.toHaveBeenCalled();
            });
            xit("shouldn't change the record attributes", function () {
            });
        });
    });
    describe('.parse', function () {
        xit("should parse the data as it comes", function () {
        });
    });
    describe('.toOriginJSON', function () {
        it("should return the record attributes as they are", function () {
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
    describe('.toOriginXML', function () {
        xit("should return the record attributes in xml format", function () {
        });
    });
    describe('.toOrigin', function () {
        it("should retrieve the attributes in xml format when 'json' format is specified", function () {
            var sdkzer = new Sdkzer(initialAttributes);
            spyOn(Sdkzer.prototype, "toOriginJSON");
            sdkzer.toOrigin('json');
            expect(sdkzer.toOriginJSON).toHaveBeenCalled();
            expect(sdkzer.attrs).toEqual(sdkzer.toOrigin('json'));
        });
        it("should retrieve the attributes in xml format when 'xml' format is specified", function () {
            var sdkzer = new Sdkzer(initialAttributes);
            spyOn(Sdkzer.prototype, "toOriginXML");
            sdkzer.toOrigin('xml');
            expect(sdkzer.toOriginXML).toHaveBeenCalled();
            expect(sdkzer.attrs).toEqual(sdkzer.toOrigin('xml'));
        });
    });
    describe('.update', function () {
        it("should update an attribute in the attributes map", function () {
        });
    });
    describe('.destroy', function () {
        it("should destroy the record in the origin", function () {
        });
    });
    describe('#fetchIndex', function () {
        xit("should retrieve a list of records from the origin", function () {
        });
        xit("should return a promise that resolves into a list of parsed records retrieved from the origin", function () {
        });
    });
    describe('#fetchOne', function () {
        xit("should retrieve a record from the origin", function () {
        });
        xit("should set the record attributes with parsed records retrieved from the origin", function () {
        });
        xit("should return a promise that resolves into a parsed record retrieved from the origin", function () {
        });
    });
});
