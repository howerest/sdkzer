/*! sdkzer 0.8.3 - By David Valin - www.davidvalin.com */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/* =========================================================================

    howerest 2023 - <hola@davidvalin.com> | www.howerest.com
    ___________________
    Apache 2.0 Licensed

    Implements a standarized & friendly API to deal with RESTful http
    resources that implement endpoints to perform the CRUD operations.

      1. Define a resource by extending Sdkzer class
      2. Define a "baseEndpoint()" function for your class
      3. Start consuming your resource

=========================================================================== */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllowedValueSwitchValidator = exports.EmailValidator = exports.LengthValidator = exports.NumberValidator = exports.RegExpValidator = exports.RequiredValidator = exports.ValidationRule = exports.Sdkzer = void 0;
class Sdkzer {
    /**
     * Creates an instance of a model entity with an API to communicate with
     * a resource (http RESTful resource)
     * @param  {object}   attrs   The initial attributes for the resource.
     *                            Those attributes are in force to defaults()
     */
    constructor(attrs = {}) {
        this.invalidMessages = {};
        this.syncing = false;
        this.lastResponse = null;
        this.attrs = { id: null };
        this.pAttrs = { id: null };
        this.setDefaults();
        for (let attrKey in attrs) {
            // Object initialization parameters are in force to default parameters
            this.attrs[attrKey] = attrs[attrKey];
            this.pAttrs[attrKey] = attrs[attrKey];
        }
    }
    /**
     * Configures Sdkzer constants that determine the behaviour of Sdkzer in all
     * classes that extend from Sdkzer in the current scope.
     * @param {ISdkzerConfigOptions} options The configuration options
     */
    static configure(options) {
        Sdkzer.DEFAULT_HTTP_HEADERS = options.defaultHttpHeaders || {};
    }
    /**
     * Sets the defaults() values in the instance attributes
     */
    setDefaults() {
        if (this.defaults()) {
            let defaults = this.defaults();
            for (let attrKey in defaults) {
                this.attrs[attrKey] = defaults[attrKey];
            }
        }
    }
    /**
     * Retrieves the defaults for the entity. Override it using your default
     * attributes if you need any
     */
    defaults() {
        return {};
    }
    /**
     * Checks wether an entity is a valid entity.
     * It doesn't perform validation (check validate())
     */
    isValid() {
        const attrs = Object.keys(this.invalidMessages);
        for (const attrName of attrs) {
            if (this.invalidMessages[attrName] && this.invalidMessages[attrName].length > 0) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks wether an entity is a valid entity
     */
    validate() {
        // Reset previous invalid messages from previous validations
        this.invalidMessages = {};
        let toValidateAttr, validationRule;
        const toValidateAttrs = Object.keys(this.validationRules || {});
        // Validate attribute's ValidationRules
        for (toValidateAttr of toValidateAttrs) {
            for (validationRule of this.validationRules[toValidateAttr]) {
                // When the ValidationRule is invalid...
                if (!validationRule.isValid(this.pAttrs[toValidateAttr], this.attrs[toValidateAttr])) {
                    if (!this.invalidMessages[toValidateAttr]) {
                        this.invalidMessages[toValidateAttr] = [];
                    }
                    // Collect the invalid message from the ValidationRules for that field
                    this.invalidMessages[toValidateAttr].push(validationRule.invalidMessage);
                }
                else {
                    this.invalidMessages[toValidateAttr] = [];
                }
            }
        }
    }
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
    attr(attrName, value) {
        // Setting an attribute?
        if (attrName !== undefined && value !== undefined) {
            // TODO: Add before&after-callback
            let attrKeys = attrName.split('.');
            let attrKeyName = '';
            eval("this.attrs['" + attrKeys.join("']['") + "'] = " + (typeof (value) === 'string' ? "'" + value + "'" : value));
        }
        else if (attrName !== undefined && value === undefined) {
            // Reading an attribute?
            let attrKeys = attrName.split('.');
            let attrValue = this.attrs[attrName.split('.')[0]];
            for (let i = 1; i < attrKeys.length; i++) {
                attrValue = attrValue[attrKeys[i]];
            }
            return attrValue;
        }
        else {
            // Reading all attributes?
            // TODO: Add before&after-callbacks
            return this.attrs || {};
        }
    }
    /**
     * Retrieves the base resource url. Override it using your base endpoint
     * for your resource.
     *
     * NOTE: You need to define a baseEndpoint method in your entities
     *  in order to be able to sync with a backend endpoint
     *  A base endpoint for a RESTful endpoint look like:
     *    return "https://www.an-api.com/v1/users"
     */
    baseEndpoint() {
        return null;
    }
    /**
     * Retrieves the resource url
     * NOTE: This method will become the interface to connect using different
     * http patterns
     */
    resourceEndpoint() {
        return '';
    }
    /**
     * Checks if the record is not saved in the origin. An record will be
     * consiered new when it has an "id" attribute set to null and it lacks of
     * a "lastResponse" attribute value
     */
    isNew() {
        return ((this.attrs.id !== null) ? false : true);
    }
    /**
     * Checks if the record has changed since the last save
     */
    hasChanged() {
        return (this.changedAttrs().length > 0 ? true : false);
    }
    /**
     * Checks if an attribute has changed from the origin
     */
    hasAttrChanged(attrName) {
        let i, changedAttrs = this.changedAttrs();
        for (i = 0; i < changedAttrs.length; i++) {
            if (changedAttrs[i] === attrName) {
                return true;
            }
        }
        return false;
    }
    /**
     * Retrieves the name of the changed attributes since the last save
     */
    changedAttrs() {
        let changedAttrs = [], currAttrs = Object.keys(this.attrs), prevAttrs = Object.keys(this.pAttrs), i, i2;
        for (i = 0; i <= currAttrs.length; i++) {
            for (i2 = 0; i2 <= prevAttrs.length; i2++) {
                if (currAttrs[i] !== null && currAttrs[i] === prevAttrs[i2] && this.attrs[currAttrs[i]] !== this.pAttrs[prevAttrs[i2]]) {
                    changedAttrs.push(currAttrs[i]);
                    break;
                }
            }
        }
        return changedAttrs;
    }
    /**
     * Retrieves the previous attributes
     */
    prevAttrs() {
        let previousAttrs = {};
        for (let attrKey in this.attrs) {
            if (this.pAttrs[attrKey] !== this.attrs[attrKey]) {
                previousAttrs[attrKey] = (this.pAttrs[attrKey] ? this.pAttrs[attrKey] : null);
            }
        }
        return previousAttrs;
    }
    /**
     * Retrieves the previous value prior to last save for a specific attribute
     */
    prevValue(attrName) {
        return this.prevAttrs()[attrName];
    }
    /**
     * Fetches the newest attributes from the origin.
     */
    fetch(httpQuery, camelize = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let _this = this, promise;
            if (this.attrs.id) {
                this.syncing = true;
                let query = {
                    url: `${this.baseEndpoint()}/${this.attrs.id}`,
                    method: 'GET',
                    headers: Sdkzer.DEFAULT_HTTP_HEADERS || {},
                    qsParams: {},
                    data: {}
                };
                if (typeof (httpQuery) !== 'undefined') {
                    query = Object.assign(Object.assign({}, query), httpQuery);
                }
                try {
                    let response = yield fetch(`${query.url}${query.qsParams ? qsToString(query.qsParams) : ''}`, {
                        method: query.method,
                        headers: query.headers,
                        body: query.data.toString()
                    });
                    // Success
                    _this.syncing = false;
                    // TODO: Keep lastResponse
                    let parsedData = _this.parseRecord(JSON.parse(yield response.json()));
                    if (camelize) {
                        // parsedData = util.Camel.camelize(parsedData);
                    }
                    // Keep track of previous attributes
                    _this.pAttrs = parsedData;
                    // Assign the parsed attributes
                    _this.attrs = parsedData;
                    return response;
                }
                catch (e) {
                    // Fail
                    _this.syncing = false;
                    return Promise.reject(false);
                }
            }
        });
    }
    /**
     * Parses a single resource record from an incoming HttpResponse data
     * NOTE: The idea is to return the parsed record data only
     */
    parseRecord(data, prefix) {
        return prefix ? data[prefix] : data;
    }
    /**
     * Parses a collection of resource records from an incoming HttpResponse data
     * NOTE: The idea is to return the parsed collection of records data only
     */
    static parseCollection(data, prefix) {
        return prefix ? data[prefix] : data;
    }
    /**
     * Transforms the local attributes to be processed by the origin in JSON format
     */
    toOriginJSON() {
        return this.attrs;
    }
    /**
     * Transforms the local attributes to be processed by the origin in XML format
     */
    toOriginXML() {
        return '';
    }
    /**
     * Transforms the local attributes to be processed by the origin in a specific format
     * @param format The format to transform into
     */
    toOrigin(format = 'json') {
        let snapshot;
        switch (format) {
            case 'json':
                snapshot = this.toOriginJSON();
                break;
            case 'xml':
                snapshot = this.toOriginXML();
                break;
        }
        return snapshot;
    }
    /**
     * Persists the local state into the origin
     */
    save(httpHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let _this = this, query, request, httpMethod = (this.attr('id') == null ? 'POST' : 'PUT');
            // New record in the origin?
            if (httpMethod === 'POST') {
                query = {
                    method: httpMethod,
                    url: this.baseEndpoint(),
                    headers: Sdkzer.DEFAULT_HTTP_HEADERS || {},
                    qsParams: {},
                    data: this.toOriginJSON()
                };
                // Existing record in the origin?
            }
            else {
                query = {
                    method: httpMethod,
                    url: `${this.baseEndpoint()}/${this.attrs.id}${query && query.qsParams ? qsToString(query.qsParams) : ''}`,
                    headers: Sdkzer.DEFAULT_HTTP_HEADERS || {},
                    qsParams: {},
                    data: this.toOriginJSON()
                };
            }
            try {
                const response = yield fetch(query.url, {
                    method: query.method,
                    headers: query.headers,
                    body: query.data.toString()
                });
                if (httpMethod === 'POST') {
                    // Append id to attributes
                    _this.attrs.id = (yield response.json())['id'];
                }
                _this.lastResponse = response;
                return response;
            }
            catch (e) {
                return Promise.reject(false);
            }
        });
    }
    /**
     * Destroys the current record in the origin
     */
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            let query;
            query = {
                method: 'DELETE',
                url: `${this.baseEndpoint()}/${this.attrs.id}`,
                headers: Sdkzer.DEFAULT_HTTP_HEADERS || {},
                qsParams: {},
                data: {}
            };
            try {
                return yield fetch(query.url, {
                    method: query.method,
                    headers: query.headers,
                    body: query.data.toString()
                });
            }
            catch (e) {
                return Promise.reject(false);
            }
        });
    }
    /**
     * Retrieves a collection of records from the origin
     * @param httpQuery An optional query to be merged with the default one
     */
    static fetchIndex(httpQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let query, request, instancesPromise, instances = [], instance;
            instancesPromise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                query = {
                    method: 'GET',
                    url: `${new this().baseEndpoint()}${httpQuery && httpQuery.qsParams ? qsToString(httpQuery.qsParams) : ''}`,
                    headers: Sdkzer.DEFAULT_HTTP_HEADERS || {},
                    qsParams: {}
                };
                if (typeof (httpQuery) !== 'undefined') {
                    query = Object.assign(Object.assign({}, query), httpQuery);
                }
                try {
                    const response = yield fetch(query.url, {
                        method: query.method,
                        headers: query.headers
                    });
                    const collectionList = this.parseCollection(JSON.parse(yield response.json()));
                    for (let i in collectionList) {
                        instance = new this();
                        instance.attrs = instance.pAttrs = instance.parseRecord(collectionList[i]);
                        instances.push(instance);
                    }
                    resolve(instances);
                }
                catch (e) {
                    reject(e);
                }
            }));
            return instancesPromise;
        });
    }
    /**
     * Retrieves a single record from the origin
     * @param id          The record id that we want to fetch by
     * @param httpQuery   Use a HttpQuery instance to override the default query
     */
    static fetchOne(id, httpQuery) {
        let model = new this(), query, instancePromise, instance;
        instancePromise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            query = {
                method: 'GET',
                url: `${model.baseEndpoint()}/${id}${httpQuery && httpQuery.qsParams ? qsToString(httpQuery.qsParams) : ''}`,
                headers: Sdkzer.DEFAULT_HTTP_HEADERS || {},
                qsParams: {}
            };
            if (typeof (httpQuery) !== 'undefined') {
                query = Object.assign(Object.assign({}, query), httpQuery);
            }
            try {
                const response = yield fetch(query.url, {
                    method: query.method,
                    headers: query.headers
                });
                instance = new this();
                instance.attrs = instance.pAttrs = instance.parseRecord(JSON.parse(yield response.json()));
                resolve(instance);
            }
            catch (e) {
                reject(e);
            }
        }));
        return instancePromise;
    }
}
// Configuration
Sdkzer.DEFAULT_HTTP_HEADERS = {};
Sdkzer.PARENTS_FETCH_STRATEGY = 'none';
exports.Sdkzer = Sdkzer;
function qsToString(qs) {
    let qsPart = '';
    // Add query string to url
    if (Object.keys(qs).length > 0) {
        qsPart += '?';
        let i = 0;
        let keys = Object.keys(qs);
        for (let key of keys) {
            if (i > 0) {
                qsPart += '&';
            }
            qsPart += `${key}=${qs[key]}`;
            i++;
        }
    }
    return qsPart;
}
var validation_rule_1 = __webpack_require__(1);
Object.defineProperty(exports, "ValidationRule", ({ enumerable: true, get: function () { return validation_rule_1.ValidationRule; } }));
var required_validator_1 = __webpack_require__(2);
Object.defineProperty(exports, "RequiredValidator", ({ enumerable: true, get: function () { return required_validator_1.RequiredValidator; } }));
var reg_exp_validator_1 = __webpack_require__(3);
Object.defineProperty(exports, "RegExpValidator", ({ enumerable: true, get: function () { return reg_exp_validator_1.RegExpValidator; } }));
var number_validator_1 = __webpack_require__(4);
Object.defineProperty(exports, "NumberValidator", ({ enumerable: true, get: function () { return number_validator_1.NumberValidator; } }));
var length_validator_1 = __webpack_require__(5);
Object.defineProperty(exports, "LengthValidator", ({ enumerable: true, get: function () { return length_validator_1.LengthValidator; } }));
var email_validator_1 = __webpack_require__(6);
Object.defineProperty(exports, "EmailValidator", ({ enumerable: true, get: function () { return email_validator_1.EmailValidator; } }));
var allowed_value_switch_validator_1 = __webpack_require__(7);
Object.defineProperty(exports, "AllowedValueSwitchValidator", ({ enumerable: true, get: function () { return allowed_value_switch_validator_1.AllowedValueSwitchValidator; } }));


/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, exports) => {


/* --------------------------------------------------------------------------

    howerest 2018 - <hola@davidvalin.com> | www.howerest.com

    Apache 2.0 Licensed
    -------------------

    ValidationRule: represents a validation rule

--------------------------------------------------------------------------- */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidationRule = void 0;
class ValidationRule {
    constructor(params) {
        this.conditions = [];
        this._invalidMessage = "Invalid";
        this.params = params;
        this._invalidMessage = "";
    }
    /**
     * Retrieves the invalid message for the ValidationRule
     */
    get invalidMessage() {
        return this._invalidMessage;
    }
    /**
     * Checks if the ValidationRule is valid
     */
    isValid(fromValue, toValue) {
        this.fromValue = fromValue;
        this.toValue = toValue;
        // Reset the invalid message
        this._invalidMessage = '';
        for (let i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i]() === false) {
                return false;
            }
        }
        return true;
    }
    /**
     * Adds an invalid message to the ValidationRule
     */
    addInvalidMessage(message) {
        this._invalidMessage += message;
    }
}
exports.ValidationRule = ValidationRule;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequiredValidator = void 0;
const validation_rule_1 = __webpack_require__(1);
class RequiredValidator extends validation_rule_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.conditions = [
            () => {
                let match = true;
                if (typeof (this.toValue) === "undefined" || this.toValue.length === 0) {
                    match = false;
                    this.addInvalidMessage("A value is required and was not provided");
                }
                return match;
            }
        ];
    }
}
exports.RequiredValidator = RequiredValidator;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegExpValidator = void 0;
const validation_rule_1 = __webpack_require__(1);
class RegExpValidator extends validation_rule_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.conditions = [
            () => {
                let match = true;
                if (!this.toValue || !this.toValue.match || !this.toValue.match(this.params.rule)) {
                    match = false;
                    this.addInvalidMessage(`${this.toValue} is not valid`);
                }
                return match;
            }
        ];
    }
}
exports.RegExpValidator = RegExpValidator;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NumberValidator = void 0;
const validation_rule_1 = __webpack_require__(1);
class NumberValidator extends validation_rule_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.conditions = [
            () => {
                let match = true;
                if (this.toValue < this.params.min) {
                    match = false;
                    this.addInvalidMessage(`${this.toValue} is smaller than ${this.params.min}`);
                }
                if (this.toValue > this.params.max) {
                    match = false;
                    this.addInvalidMessage(`${this.toValue} is bigger than ${this.params.max}`);
                }
                return match;
            }
        ];
    }
}
exports.NumberValidator = NumberValidator;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LengthValidator = void 0;
const validation_rule_1 = __webpack_require__(1);
class LengthValidator extends validation_rule_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.conditions = [
            () => {
                let match = true;
                if (this.toValue.length < this.params.min) {
                    match = false;
                    this.addInvalidMessage(`${this.toValue} contains less than ${this.params.min} items`);
                }
                if (this.toValue.length > this.params.max) {
                    match = false;
                    this.addInvalidMessage(`${this.toValue} contains more than ${this.params.max} items`);
                }
                return match;
            }
        ];
    }
}
exports.LengthValidator = LengthValidator;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailValidator = void 0;
const validation_rule_1 = __webpack_require__(1);
const reg_exp_validator_1 = __webpack_require__(3);
class EmailValidator extends validation_rule_1.ValidationRule {
    constructor() {
        super(...arguments);
        this.conditions = [
            // Check for email regexp...
            () => {
                let match = true;
                const regExpValidator = new reg_exp_validator_1.RegExpValidator({ rule: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i });
                if (!regExpValidator.isValid(this.fromValue, this.toValue)) {
                    this.addInvalidMessage(`${this.toValue} is not a valid email address`);
                    match = false;
                }
                return match;
            }
        ];
    }
}
exports.EmailValidator = EmailValidator;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllowedValueSwitchValidator = void 0;
const validation_rule_1 = __webpack_require__(1);
class AllowedValueSwitchValidator extends validation_rule_1.ValidationRule {
    constructor() {
        // Sample declaration of allowed transition:
        super(...arguments);
        // {
        //   allowed: [
        //     { from: "open", to: ["scheduled", "canceled", "closed"] },
        //     { from: "close", to: ["open"] }
        //   ]
        // }
        this.conditions = [
            () => {
                let match = false, rule;
                if (this.params && this.params.allowed && this.params.allowed.length) {
                    for (let i = 0; i < this.params.allowed.length; i++) {
                        rule = this.params.allowed[i];
                        if (rule.from && rule.to && rule.to.length) {
                            // Origin value matched
                            if (rule.from === this.fromValue) {
                                // Check that the destination value also allowed
                                for (let i2 = 0; i2 < rule.to.length; i2++) {
                                    if (!match) {
                                        if (this.toValue === rule.to[i2]) {
                                            match = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (!match) {
                    this.addInvalidMessage(`${this.fromValue} cannot change to '${this.toValue}'`);
                }
                return match;
            }
        ];
    }
}
exports.AllowedValueSwitchValidator = AllowedValueSwitchValidator;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=howerest.sdkzer.js.map