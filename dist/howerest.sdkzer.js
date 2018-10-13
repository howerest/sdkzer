/*! sdkzer 0.6.5 - By David Valin - www.davidvalin.com */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* --------------------------------------------------------------------------

    howerest 2018 - <hola@davidvalin.com> | www.howerest.com

    Apache 2.0 Licensed
    -------------------

    Implements a standarized & friendly API to deal with RESTful http resources
    that implement endpoints to perform the CRUD operations

    1. Define a resource:
    2. Start consuming your resource

--------------------------------------------------------------------------- */
Object.defineProperty(exports, "__esModule", { value: true });
var js_webservices_1 = __webpack_require__(1);
var Sdkzer = /** @class */ (function () {
    /**
     * Creates an instance of a model entity with an API to communicate with
     * a resource (http RESTful resource)
     * @param  {Object}   attrs   The initial attributes for the resource.
     *                            Those attributes are in force to defaults()
     */
    function Sdkzer(attrs) {
        if (attrs === void 0) { attrs = {}; }
        this.invalidMessages = {};
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
     * Checks wether an entity is a valid entity.
     * It doesn't perform validation (check validate())
     */
    Sdkzer.prototype.isValid = function () {
        var attrs = Object.keys(this.invalidMessages);
        for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
            var attrName = attrs_1[_i];
            if (this.invalidMessages[attrName] && this.invalidMessages[attrName].length > 0) {
                return false;
            }
        }
        return true;
    };
    /**
     * Checks wether an entity is a valid entity
     */
    Sdkzer.prototype.validate = function () {
        var isValid = true, toValidateAttr, validationRule;
        var toValidateAttrs = Object.keys(this.validationRules);
        // Validate attribute's ValidationRules
        for (var _i = 0, toValidateAttrs_1 = toValidateAttrs; _i < toValidateAttrs_1.length; _i++) {
            toValidateAttr = toValidateAttrs_1[_i];
            for (var _a = 0, _b = this.validationRules[toValidateAttr]; _a < _b.length; _a++) {
                validationRule = _b[_a];
                if (!validationRule.isValid(this.pAttrs[toValidateAttr], this.attrs[toValidateAttr])) {
                    if (!this.invalidMessages[toValidateAttr]) {
                        this.invalidMessages[toValidateAttr] = [];
                    }
                    this.invalidMessages[toValidateAttr].push(validationRule.invalidMessage);
                }
                else {
                    this.invalidMessages[toValidateAttr] = [];
                }
            }
        }
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
    Sdkzer.prototype.fetch = function (httpQuery, camelize) {
        if (camelize === void 0) { camelize = true; }
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
                var parsedData = _this.parseRecord(response.data);
                if (camelize) {
                    // parsedData = util.Camel.camelize(parsedData);
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
            promise = Promise.reject(false);
        }
        return promise;
    };
    /**
     * Parses a single resource record from an incoming HttpResponse data
     * NOTE: The idea is to return the parsed record data only
     */
    Sdkzer.prototype.parseRecord = function (data, prefix) {
        return prefix ? data[prefix] : data;
    };
    /**
     * Parses a collection of resource records from an incoming HttpResponse data
     * NOTE: The idea is to return the parsed collection of records data only
     */
    Sdkzer.parseCollection = function (data, prefix) {
        return prefix ? data[prefix] : data;
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
        return '';
    };
    /**
     * Transforms the local attributes to be processed by the origin in a specific format
     */
    Sdkzer.prototype.toOrigin = function (format) {
        if (format === void 0) { format = "json"; }
        var snapshot;
        switch (format) {
            case "json":
                snapshot = this.toOriginJSON();
                break;
            case "xml":
                snapshot = this.toOriginXML();
                break;
        }
        return snapshot;
    };
    /**
     * Saves the local object into the origin
     */
    Sdkzer.prototype.save = function (httpHeaders) {
        if (httpHeaders === void 0) { httpHeaders = []; }
        var _this = this, query, request, httpMethod = (this.attr('id') == null ? "POST" : "PUT");
        // New record in the origin?
        if (httpMethod == "POST") {
            query = new js_webservices_1.WebServices.HttpQuery({
                httpMethod: httpMethod,
                endpoint: this.baseEndpoint(),
                headers: Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
                qsParams: {},
                data: this.toOriginJSON()
            });
            // Existing record in the origin?
        }
        else {
            query = new js_webservices_1.WebServices.HttpQuery({
                httpMethod: httpMethod,
                endpoint: this.baseEndpoint() + '/' + this.attrs['id'],
                headers: Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
                qsParams: {},
                data: this.toOriginJSON()
            });
        }
        request = new js_webservices_1.WebServices.HttpRequest(query);
        return request.promise.then(
        // Success
        function (response) {
            if (httpMethod == "POST") {
                // Append id to attributes
                _this.attrs['id'] = response.data['id'];
            }
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
        var _this_1 = this;
        var query, request, instancesPromise, instances = [], instance;
        instancesPromise = new Promise(function (resolve, reject) {
            query = new js_webservices_1.WebServices.HttpQuery({
                httpMethod: "GET",
                endpoint: (new _this_1().baseEndpoint()),
                headers: Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
                qsParams: {},
                data: {}
            });
            if (typeof (httpQuery) !== 'undefined') {
                query = js_webservices_1.WebServices.Merger.mergeHttpQueries([query, httpQuery]);
            }
            request = new js_webservices_1.WebServices.HttpRequest(query);
            request.promise.then(function (response) {
                var collectionList = _this_1.parseCollection(response.data);
                for (var i in collectionList) {
                    instance = new _this_1();
                    instance.attrs = instance.pAttrs = instance.parseRecord(collectionList[i]);
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
        var _this_1 = this;
        var model = new this(), query, request, instancePromise, instance;
        instancePromise = new Promise(function (resolve, reject) {
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
                instance = new _this_1();
                instance.attrs = instance.pAttrs = instance.parseRecord(response.data);
                resolve(instance);
            }, function (error) {
                reject(error);
            });
        });
        return instancePromise;
    };
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
    return Sdkzer;
}());
exports.Sdkzer = Sdkzer;
var validation_rule_1 = __webpack_require__(2);
exports.ValidationRule = validation_rule_1.ValidationRule;
var required_validator_1 = __webpack_require__(3);
exports.RequiredValidator = required_validator_1.RequiredValidator;
var reg_exp_validator_1 = __webpack_require__(4);
exports.RegExpValidator = reg_exp_validator_1.RegExpValidator;
var min_max_number_validator_1 = __webpack_require__(5);
exports.MinMaxNumberValidator = min_max_number_validator_1.MinMaxNumberValidator;
var length_validator_1 = __webpack_require__(6);
exports.LengthValidator = length_validator_1.LengthValidator;
var email_validator_1 = __webpack_require__(7);
exports.EmailValidator = email_validator_1.EmailValidator;
var allowed_value_switch_validator_1 = __webpack_require__(8);
exports.AllowedValueSwitchValidator = allowed_value_switch_validator_1.AllowedValueSwitchValidator;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("js-webservices");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* --------------------------------------------------------------------------

    howerest 2018 - <hola@davidvalin.com> | www.howerest.com

    Apache 2.0 Licensed
    -------------------

    ValidationRule: represents a validation rule

--------------------------------------------------------------------------- */
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationRule = /** @class */ (function () {
    function ValidationRule(params) {
        this.conditions = [];
        this._invalidMessage = "Invalid";
        this.params = params;
        this._invalidMessage = "";
    }
    Object.defineProperty(ValidationRule.prototype, "invalidMessage", {
        /**
         * Retrieves the invalid message for the ValidationRule
         */
        get: function () {
            return this._invalidMessage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if the ValidationRule is valid
     */
    ValidationRule.prototype.isValid = function (fromValue, toValue) {
        this.fromValue = fromValue;
        this.toValue = toValue;
        // Reset the invalid message
        this._invalidMessage = '';
        for (var i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i]() === false) {
                return false;
            }
        }
        return true;
    };
    /**
     * Adds an invalid message to the ValidationRule
     */
    ValidationRule.prototype.addInvalidMessage = function (message) {
        this._invalidMessage += message;
    };
    return ValidationRule;
}());
exports.ValidationRule = ValidationRule;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var validation_rule_1 = __webpack_require__(2);
var RequiredValidator = /** @class */ (function (_super) {
    __extends(RequiredValidator, _super);
    function RequiredValidator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.conditions = [
            function () {
                var match = true;
                if (typeof (_this.toValue) === "undefined" || _this.toValue.length === 0) {
                    match = false;
                    _this.addInvalidMessage("A value is required and was not provided");
                }
                return match;
            }
        ];
        return _this;
    }
    return RequiredValidator;
}(validation_rule_1.ValidationRule));
exports.RequiredValidator = RequiredValidator;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var validation_rule_1 = __webpack_require__(2);
var RegExpValidator = /** @class */ (function (_super) {
    __extends(RegExpValidator, _super);
    function RegExpValidator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.conditions = [
            function () {
                var match = true;
                if (!_this.toValue || !_this.toValue.match || !_this.toValue.match(_this.params['rule'])) {
                    match = false;
                }
                return match;
            }
        ];
        return _this;
    }
    return RegExpValidator;
}(validation_rule_1.ValidationRule));
exports.RegExpValidator = RegExpValidator;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var validation_rule_1 = __webpack_require__(2);
var MinMaxNumberValidator = /** @class */ (function (_super) {
    __extends(MinMaxNumberValidator, _super);
    function MinMaxNumberValidator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.conditions = [
            function () {
                var match = true;
                if (_this.toValue.length < _this.params['min']) {
                    match = false;
                    _this.addInvalidMessage(_this.toValue + " is shorter than " + _this.params['min']);
                }
                if (_this.toValue.length > _this.params['max']) {
                    match = false;
                    _this.addInvalidMessage(_this.toValue + " is longer than " + _this.params['max']);
                }
                return match;
            }
        ];
        return _this;
    }
    return MinMaxNumberValidator;
}(validation_rule_1.ValidationRule));
exports.MinMaxNumberValidator = MinMaxNumberValidator;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var validation_rule_1 = __webpack_require__(2);
var LengthValidator = /** @class */ (function (_super) {
    __extends(LengthValidator, _super);
    function LengthValidator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.conditions = [
            function () {
                var match = true;
                if (_this.toValue.length < _this.params['min']) {
                    match = false;
                    _this.addInvalidMessage(_this.toValue + " is shorter than " + _this.params['min']);
                }
                if (_this.toValue.length > _this.params['max']) {
                    match = false;
                    _this.addInvalidMessage(_this.toValue + " is longer than " + _this.params['max']);
                }
                return match;
            }
        ];
        return _this;
    }
    return LengthValidator;
}(validation_rule_1.ValidationRule));
exports.LengthValidator = LengthValidator;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var validation_rule_1 = __webpack_require__(2);
var reg_exp_validator_1 = __webpack_require__(4);
var EmailValidator = /** @class */ (function (_super) {
    __extends(EmailValidator, _super);
    function EmailValidator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.conditions = [
            // Check for email regexp...
            function () {
                var match = true;
                var regExpValidator = new reg_exp_validator_1.RegExpValidator({ rule: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i });
                if (!regExpValidator.isValid(_this.fromValue, _this.toValue)) {
                    _this.addInvalidMessage(_this.toValue + ' is not a valid email address');
                    match = false;
                }
                return match;
            }
        ];
        return _this;
    }
    return EmailValidator;
}(validation_rule_1.ValidationRule));
exports.EmailValidator = EmailValidator;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var validation_rule_1 = __webpack_require__(2);
var AllowedValueSwitchValidator = /** @class */ (function (_super) {
    __extends(AllowedValueSwitchValidator, _super);
    function AllowedValueSwitchValidator() {
        // Sample declaration of allowed transition:
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // {
        //   matches: [
        //     { from: "open", to: ["scheduled", "canceled", "closed"] },
        //     { from: "close", to: ["open"] }
        //   ]
        // }
        _this.conditions = [
            function () {
                var match = false;
                if (_this.params && _this.params['matches'] && _this.params['matches'].length) {
                    for (var i = 0; i < _this.params['matches'].length; i++) {
                        var rule = _this.params['matches'][i];
                        if (rule['from'] && rule['to'] && rule['to'].length) {
                            // Origin value matched
                            if (rule['from'] === _this.fromValue) {
                                // Check that the destination value also matches
                                for (var i2 = 0; i2 < rule['to'].length; i2++) {
                                    if (!match) {
                                        if (_this.toValue === rule['to'][i2] && !match) {
                                            match = true;
                                        }
                                    }
                                }
                            }
                            else {
                                match = false;
                            }
                        }
                    }
                }
                if (!match) {
                    _this.addInvalidMessage(_this.fromValue + " cannot change to '" + _this.toValue + "'");
                }
                return match;
            }
        ];
        return _this;
    }
    return AllowedValueSwitchValidator;
}(validation_rule_1.ValidationRule));
exports.AllowedValueSwitchValidator = AllowedValueSwitchValidator;


/***/ })
/******/ ]);
});
//# sourceMappingURL=howerest.sdkzer.js.map