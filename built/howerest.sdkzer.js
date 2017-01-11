"use strict";
var es6_promise_1 = require("es6-promise");
var js_webservices_1 = require("js-webservices");
/* --------------------------------------------------------------------------

    howerest 2016 - <davidvalin@howerest.com> | www.howerest.com

    Apache 2.0 Licensed
    -------------------

    Implements a standarized & friendly API to deal with RESTful http resources
    that implement endpoints to perform the CRUD operations

    1. Define a resource:
    2. Start consuming your resource

--------------------------------------------------------------------------- */
var Sdkzer = (function () {
    /**
     * Creates an instance of a model entity with an API to communicate with
     * a resource (http RESTful resource)
     * @param  {Object}   attrs   The initial attributes for the resource.
     *                            Those attributes are in force to defaults()
     */
    function Sdkzer(attrs) {
        if (attrs === void 0) { attrs = {}; }
        this.syncing = false;
        this.lastResponse = null;
        this.attrs = { id: null };
        this.pAttrs = { id: null };
        this.setDefaults();
        for (var attrKey in attrs) {
            // Object initialization parameters are in force to default parameters
            this.attrs[attrKey] = attrs[attrKey];
            this.pAttrs[attrKey] = attrs[attrKey];
        }
    }
    /**
     * Configures Sdkzer constants that determine the behaviour of Sdkzer in all
     * classes that extend from Sdkzer in the current scope.
     * @param options {ISdkzerConfigOptions} The configuration options
     */
    Sdkzer.configure = function (options) {
        if (options['defaultHttpHeaders']) {
            Sdkzer['DEFAULT_HTTP_HEADERS'] = [];
            for (var i = 0; i < options['defaultHttpHeaders'].length; i++) {
                Sdkzer['DEFAULT_HTTP_HEADERS'].push(new js_webservices_1.WebServices.HttpHeader(options['defaultHttpHeaders'][i]));
            }
        }
        // Sdkzer['HTTP_PATTERN'] = options['httpPattern'] ? options['httpPattern'] : this['HTTP_PATTERN'];
        // Sdkzer['PARENTS_FETCH_STRATEGY'] = options['parentsFetchStrategy'] ? options['parentsFetchStrategy'] : this['PARENTS_FETCH_STRATEGY'];
        // Sdkzer['HTTP_QUERY_GUESS_CONFIG'] = options['httpQueryGuessConfig'] ? options['httpQueryGuessConfig'] : this['HTTP_QUERY_GUESS_CONFIG'];
    };
    /**
     * Checks if Sdkzer has been configured to communicate to RESTful resources
     */
    Sdkzer.usingRestfulCrudHttpPattern = function () {
        return (Sdkzer['HTTP_PATTERN'] === 'restful_crud' ? true : false);
    };
    /**
     * Checks if Sdkzer has been configured to communicate using custom CRUD endpoints
     */
    Sdkzer.usingCustomHttpPattern = function () {
        return (Sdkzer['HTTP_PATTERN'] !== 'restful_crud' ? true : false);
    };
    /**
     * Checks if Sdkzer is using any fetch strategy once received parent ids
     */
    Sdkzer.usingParentsFetchStrategy = function () {
        return Sdkzer['PARENTS_FETCH_STRATEGY'] !== 'none' ? true : false;
    };
    /**
     * Retrieves the http guess config for an specific CRUD operation.
     * @param {String} operation  Accepts "create", "read", "update" and "delete"
     */
    Sdkzer.getHttpQueryGuessConfigFor = function (operation) {
        if (Sdkzer.usingRestfulCrudHttpPattern()) {
            return Sdkzer['HTTP_QUERY_GUESS_CONFIG']['restful_crud'];
        }
        else {
            return Sdkzer['HTTP_QUERY_GUESS_CONFIG']['custom'];
        }
    };
    /**
     * Sets the defaults() values in the instance attributes
     */
    Sdkzer.prototype.setDefaults = function () {
        if (this.defaults()) {
            var defaults = this.defaults();
            for (var attrKey in defaults) {
                this.attrs[attrKey] = defaults[attrKey];
            }
        }
    };
    /**
     * Retrieves the defaults for the entity. Override it using your default
     * attributes if you need any
     */
    Sdkzer.prototype.defaults = function () {
        return {};
    };
    /**
     * This method can do 3 different things:
     *
     * - 1) Reads all attributes. When called as instance.attr()
     * - 2) Read one attribute. When called as instance.attr('name')
     * - 3) Set one attribute. When called as instance.attr('name', 'Bruce Lee')
     *
     * It's recommended to use this method instead of accessing to attr attribute
     * directly. This allows you to execute logic before and after setting or
     * reading attributes. Also, instead of creating 100 setters and getters,
     * we use a single attr() method
     *
     * @param attrName  The attribute name that we want to read or set
     * @param value     The attribute value that we want to set for "attrName"
     */
    Sdkzer.prototype.attr = function (attrName, value) {
        // Setting an attribute?
        if (attrName !== undefined && value !== undefined) {
            // TODO: Add before&after-callback
            var attrKeys = attrName.split('.');
            var attrKeyName = '';
            eval("this.attrs['" + attrKeys.join("']['") + "'] = " + (typeof (value) === 'string' ? "'" + value + "'" : value));
        }
        else if (attrName !== undefined && value === undefined) {
            // Reading an attribute?
            var attrKeys = attrName.split('.');
            var attrValue = this.attrs[attrName.split('.')[0]];
            for (var i = 1; i < attrKeys.length; i++) {
                attrValue = attrValue[attrKeys[i]];
            }
            return attrValue;
        }
        else {
            // Reading all attributes?
            // TODO: Add before&after-callbacks
            return this.attrs;
        }
    };
    /**
     * Retrieves the base resource url. Override it using your base endpoint
     * for your resource.
     *
     * NOTE: You need to define a baseEndpoint method in your entities
     *  in order to be able to sync with a backend endpoint
     *  A base endpoint for a RESTful endpoint look like:
     *    return "https://www.an-api.com/v1/users"
     */
    Sdkzer.prototype.baseEndpoint = function () {
        return null;
    };
    /**
     * Retrieves the resource url
     * NOTE: This method will become the interface to connect using different
     * http patterns
     */
    Sdkzer.prototype.resourceEndpoint = function () {
        return '';
    };
    /**
     * Checks if the record is not saved in the origin. An record will be
     * consiered new when it has an "id" attribute set to null and it lacks of
     * a "lastResponse" attribute value
     */
    Sdkzer.prototype.isNew = function () {
        return ((this.attrs['id'] !== null && this.lastResponse !== null) ? false : true);
    };
    /**
     * Checks if the record has changed since the last save
     */
    Sdkzer.prototype.hasChanged = function () {
        return (this.changedAttrs().length > 0 ? true : false);
    };
    /**
     * Checks if an attribute has changed from the origin
     */
    Sdkzer.prototype.hasAttrChanged = function (attrName) {
        var i, changedAttrs = this.changedAttrs();
        for (i = 0; i < changedAttrs.length; i++) {
            if (changedAttrs[i] === attrName) {
                return true;
            }
        }
        return false;
    };
    /**
     * Retrieves the name of the changed attributes since the last save
     */
    Sdkzer.prototype.changedAttrs = function () {
        var changedAttrs = [], currAttrs = Object.keys(this['attrs']), prevAttrs = Object.keys(this['pAttrs']), i, i2;
        for (i = 0; i <= currAttrs.length; i++) {
            for (i2 = 0; i2 <= prevAttrs.length; i2++) {
                if (currAttrs[i] !== null && currAttrs[i] === prevAttrs[i2] && this.attrs[currAttrs[i]] !== this.pAttrs[prevAttrs[i2]]) {
                    changedAttrs.push(currAttrs[i]);
                    break;
                }
            }
        }
        return changedAttrs;
    };
    /**
     * Retrieves the previous attributes
     */
    Sdkzer.prototype.prevAttrs = function () {
        var previousAttrs = {};
        for (var attrKey in this.attrs) {
            if (this.pAttrs[attrKey] !== this.attrs[attrKey]) {
                previousAttrs[attrKey] = (this.pAttrs[attrKey] ? this.pAttrs[attrKey] : null);
            }
        }
        return previousAttrs;
    };
    /**
     * Retrieves the previous value prior to last save for a specific attribute
     */
    Sdkzer.prototype.prevValue = function (attrName) {
        return this.prevAttrs()[attrName];
    };
    /**
     * Fetches the newest attributes from the origin.
     */
    Sdkzer.prototype.fetch = function (httpQuery, camelize /* TODO: give and merge a HttpQuery optionally */) {
        if (camelize === void 0) { camelize = true; } /* TODO: give and merge a HttpQuery optionally */
        var _this = this, promise;
        if (this.attrs['id']) {
            this.syncing = true;
            var query = new js_webservices_1.WebServices.HttpQuery({
                httpMethod: "GET",
                endpoint: this.baseEndpoint() + '/' + this.attrs['id'],
                headers: Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
                qsParams: {},
                data: {}
            });
            if (typeof (httpQuery) !== 'undefined') {
                query = js_webservices_1.WebServices.Merger.mergeHttpQueries([query, httpQuery]);
            }
            var request = new js_webservices_1.WebServices.HttpRequest(query);
            promise = request.promise;
            promise.then(
            // Success
            function (response) {
                _this.syncing = false;
                // TODO: Keep lastResponse
                var parsedData = _this.$parse(response.data);
                if (camelize) {
                }
                // Keep track of previous attributes
                _this.pAttrs = parsedData;
                // Assign the parsed attributes
                _this.attrs = parsedData;
            }, 
            // Fail
            function (response) {
                _this.syncing = false;
            });
        }
        if (typeof (promise) === 'undefined') {
            promise = es6_promise_1.Promise.reject(false);
        }
        return promise;
    };
    /**
     * Parses the resources data from an incoming HttpResponse
     * The idea is to return the resources attributes exclusively
     */
    Sdkzer.prototype.$parse = function (data, dataPrefixKey) {
        if (dataPrefixKey !== null && data[dataPrefixKey]) {
            return data[dataPrefixKey];
        }
        else {
            return data;
        }
    };
    /**
     * Transforms the local attributes to be processed by the origin in JSON format
     */
    Sdkzer.prototype.toOriginJSON = function () {
        return this.attrs;
    };
    /**
     * Transforms the local attributes to be processed by the origin in XML format
     */
    Sdkzer.prototype.toOriginXML = function () {
        // TODO: Implement
        return '';
    };
    /**
     * Transforms the local attributes to be processed by the origin in a specific format
     */
    Sdkzer.prototype.toOrigin = function (format) {
        switch (format) {
            case 'json':
                this.toOriginJSON();
                break;
            case 'xml':
                this.toOriginXML();
                break;
        }
        return this.attrs;
    };
    /**
     * Updates the local object into the origin
     */
    Sdkzer.prototype.update = function (httpHeaders) {
        if (httpHeaders === void 0) { httpHeaders = []; }
        var _this = this, query, request;
        // TODO: Adapt tests to test at least restful HTTP_QUERY_GUESS_CONFIG applied to verb and endpoint
        if (Sdkzer.HTTP_PATTERN === 'restful-crud') {
        }
        query = new js_webservices_1.WebServices.HttpQuery({
            httpMethod: "PUT",
            endpoint: this.baseEndpoint() + '/' + this.attrs['id'],
            headers: Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
            qsParams: {},
            data: this.toOriginJSON()
        });
        request = new js_webservices_1.WebServices.HttpRequest(query);
        return request.promise.then(
        // Success
        function (response) {
            _this.lastResponse = response;
        });
    };
    /**
     * Destroys the current record in the origin
     */
    Sdkzer.prototype.destroy = function () {
        var query, request;
        query = new js_webservices_1.WebServices.HttpQuery({
            httpMethod: "DELETE",
            endpoint: this.baseEndpoint() + '/' + this.attrs['id'],
            headers: Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
            qsParams: {},
            data: {}
        });
        request = new js_webservices_1.WebServices.HttpRequest(query);
        return request.promise;
    };
    /**
     * Retrieves a collection of records from the origin
     */
    Sdkzer.fetchIndex = function (httpQuery) {
        var _this = this;
        var query, request, instancesPromise, instances = [], instance;
        // TODO: guess endpont and verb based on custom http pattern
        instancesPromise = new es6_promise_1.Promise(function (resolve, reject) {
            query = new js_webservices_1.WebServices.HttpQuery({
                httpMethod: "GET",
                endpoint: (new _this().baseEndpoint()),
                headers: Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
                qsParams: {},
                data: {}
            });
            if (typeof (httpQuery) !== 'undefined') {
                query = js_webservices_1.WebServices.Merger.mergeHttpQueries([query, httpQuery]);
            }
            request = new js_webservices_1.WebServices.HttpRequest(query);
            request.promise.then(function (response) {
                for (var i in response.data) {
                    instance = new _this();
                    instance.attrs = instance.pAttrs = instance.$parse(response.data[i]);
                    instances.push(instance);
                }
                resolve(instances);
            }, function (error) {
                reject(error);
            });
        });
        return instancesPromise;
    };
    /**
     * Retrieves a single record from the origin
     * @param id          The record id that we want to fetch by
     * @param httpQuery   Use a HttpQuery instance to override the default query
     */
    Sdkzer.fetchOne = function (id, httpQuery) {
        var _this = this;
        var model = new this(), query, request, instancePromise, instance;
        instancePromise = new es6_promise_1.Promise(function (resolve, reject) {
            query = new js_webservices_1.WebServices.HttpQuery({
                httpMethod: "GET",
                endpoint: model.baseEndpoint() + '/' + id,
                headers: Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
                qsParams: {},
                data: {}
            });
            if (typeof (httpQuery) !== 'undefined') {
                query = js_webservices_1.WebServices.Merger.mergeHttpQueries([query, httpQuery]);
            }
            request = new js_webservices_1.WebServices.HttpRequest(query);
            request.promise.then(function (response) {
                instance = new _this();
                instance.attrs = instance.pAttrs = instance.$parse(response.data);
                resolve(instance);
            }, function (error) {
                reject(error);
            });
        });
        return instancePromise;
    };
    return Sdkzer;
}());
// Configuration
Sdkzer.DEFAULT_HTTP_HEADERS = [];
Sdkzer.HTTP_PATTERN = 'restful_crud';
Sdkzer.PARENTS_FETCH_STRATEGY = 'none';
Sdkzer.HTTP_QUERY_GUESS_CONFIG = {
    "restful_crud": {
        "read_collection": {
            verb: "GET",
            endpoint: ''
        },
        "read_record": {
            verb: "GET",
            endpoint: ''
        },
        "create_record": {
            verb: "GET",
            endpoint: ''
        },
        "update_record": {
            verb: "GET",
            endpoint: ''
        },
        "delete_record": {
            verb: "GET",
            endpoint: ''
        }
    }
};
exports.Sdkzer = Sdkzer;
