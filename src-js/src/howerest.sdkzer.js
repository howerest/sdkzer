/*!
 * Implements functionality to deal with restful http services
 * @params {attrs} Initial attributes
 */
var Sdkzer = (function () {
    function Sdkzer(attrs) {
        if (attrs === void 0) { attrs = {}; }
        this.syncing = false;
        this.lastResponse = null;
        this.attrs = { id: null };
        this.pAttrs = { id: null };
        this.setDefaults();
        for (var attrKey in attrs) {
            this.attrs[attrKey] = attrs[attrKey];
            this.pAttrs[attrKey] = attrs[attrKey];
        }
    }
    Sdkzer.configure = function (options) {
        if (options['defaultHttpHeaders']) {
            Sdkzer['DEFAULT_HTTP_HEADERS'] = [];
            for (var i = 0; i < options['defaultHttpHeaders'].length; i++) {
                Sdkzer['DEFAULT_HTTP_HEADERS'].push(new WebServices.HttpHeader(options['defaultHttpHeaders'][i]));
            }
        }
        Sdkzer['HTTP_PATTERN'] = options['httpPattern'] ? options['httpPattern'] : this['HTTP_PATTERN'];
        Sdkzer['PARENTS_FETCH_STRATEGY'] = options['parentsFetchStrategy'] ? options['parentsFetchStrategy'] : this['PARENTS_FETCH_STRATEGY'];
        Sdkzer['HTTP_QUERY_GUESS_CONFIG'] = options['httpQueryGuessConfig'] ? options['httpQueryGuessConfig'] : this['HTTP_QUERY_GUESS_CONFIG'];
    };
    Sdkzer.usingRestfulCrudHttpPattern = function () {
        return (Sdkzer['HTTP_PATTERN'] === 'restful_crud' ? true : false);
    };
    Sdkzer.usingCustomHttpPattern = function () {
        return (Sdkzer['HTTP_PATTERN'] !== 'restful_crud' ? true : false);
    };
    Sdkzer.usingParentsFetchStrategy = function () {
        return Sdkzer['PARENTS_FETCH_STRATEGY'] !== 'none' ? true : false;
    };
    Sdkzer.getHttpQueryGuessConfigFor = function (operation) {
        if (Sdkzer.usingRestfulCrudHttpPattern()) {
            return Sdkzer['HTTP_QUERY_GUESS_CONFIG']['restful_crud'];
        }
        else {
            return Sdkzer['HTTP_QUERY_GUESS_CONFIG']['custom'];
        }
    };
    Sdkzer.prototype.setDefaults = function () {
        if (this.defaults()) {
            var defaults = this.defaults();
            for (var attrKey in defaults) {
                this.attrs[attrKey] = defaults[attrKey];
            }
        }
    };
    Sdkzer.prototype.defaults = function () {
        return {};
    };
    Sdkzer.prototype.attr = function (attrName, value) {
        if (attrName !== undefined && value !== undefined) {
            this.attrs[attrName] = value;
        }
        else if (attrName !== undefined && value === undefined) {
            return this.attrs[attrName];
        }
        else {
            return this.attrs;
        }
    };
    Sdkzer.prototype.resourceEndpoint = function () {
        return '';
    };
    Sdkzer.prototype.isNew = function () {
        return (this.attrs['id'] !== null) ? false : true;
    };
    Sdkzer.prototype.hasChanged = function () {
        return this.changedAttrs().length > 0 ? true : false;
    };
    Sdkzer.prototype.hasAttrChanged = function (attrName) {
        var i, changedAttrs = this.changedAttrs();
        for (i = 0; i < changedAttrs.length; i++) {
            if (changedAttrs[i] === attrName) {
                return true;
            }
        }
        return false;
    };
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
    Sdkzer.prototype.prevAttrs = function () {
        var previousAttrs = {};
        for (var attrKey in this.attrs) {
            if (this.pAttrs[attrKey] !== this.attrs[attrKey]) {
                previousAttrs[attrKey] = (this.pAttrs[attrKey] ? this.pAttrs[attrKey] : null);
            }
        }
        return previousAttrs;
    };
    Sdkzer.prototype.previousValue = function (attrName) {
    };
    Sdkzer.prototype.fetch = function (origin, camelize, httpHeaders) {
        if (camelize === void 0) { camelize = true; }
        if (httpHeaders === void 0) { httpHeaders = []; }
        var _this = this, promise;
        if (this.attrs['id']) {
            this.syncing = true;
            var query = new WebServices.HttpQuery({
                httpMethod: "GET",
                endpoint: this.resourceEndpoint() + '/' + this.attrs['id'],
                qsParams: {},
                headers: [],
                data: {}
            });
            var request = new WebServices.HttpRequest(query);
            promise = request.promise;
            promise.then(function (response) {
                console.log('Success!!');
                _this.syncing = false;
                var parsedData = _this.parse(response.data);
                if (camelize) {
                }
                for (var attrKey in parsedData) {
                    if (_this.attrs[attrKey] != parsedData[attrKey]) {
                        _this.pAttrs[attrKey] = parsedData[attrKey];
                    }
                }
                _this.attrs = parsedData;
            }, function (response) {
                console.log('failed with: ', response);
                _this.syncing = false;
            });
        }
        if (typeof (promise) === 'undefined') {
            promise = new Promise(function (resolve, reject) { });
            promise = Promise.reject(false);
        }
        return promise;
    };
    Sdkzer.prototype.parse = function (data) {
        return data;
    };
    Sdkzer.prototype.toOriginJSON = function () {
        return this.attrs;
    };
    Sdkzer.prototype.toOriginXML = function () {
    };
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
    Sdkzer.prototype.update = function (httpHeaders) {
        if (httpHeaders === void 0) { httpHeaders = []; }
        var _this = this, query, request;
        if (Sdkzer.HTTP_PATTERN === 'restful-crud') {
        }
        if (this.hasChanged()) {
            query = new WebServices.HttpQuery({
                httpMethod: "PUT",
                endpoint: this.resourceEndpoint() + '/' + this.attrs['id'],
                headers: [],
                qsParams: {},
                data: {}
            });
            request = new WebServices.HttpRequest(query);
            return request.promise.then(function (response) {
                _this.lastResponse = response;
            });
        }
    };
    Sdkzer.prototype.destroy = function () {
        var query, request;
        query = new WebServices.HttpQuery({
            httpMethod: "DELETE",
            endpoint: this.resourceEndpoint() + '/' + this.attrs['id'],
            qsParams: {},
            headers: [],
            data: {}
        });
        request = new WebServices.HttpRequest(query);
    };
    Sdkzer.fetchIndex = function (httpQuery) {
        var query, request;
        query = new WebServices.HttpQuery({
            httpMethod: "GET",
            endpoint: (new this().resourceEndpoint()),
            headers: [],
            qsParams: {},
            data: {}
        });
        request = new WebServices.HttpRequest(query);
        return request.promise;
    };
    Sdkzer.fetchOne = function (id, httpQuery) {
        var model = new this(), query, request;
        if (typeof (httpQuery) === 'undefined') {
            query = new WebServices.HttpQuery({
                httpMethod: "GET",
                endpoint: model.resourceEndpoint() + '/' + id,
                qsParams: {},
                headers: [],
                data: {}
            });
        }
        else {
            query = httpQuery;
        }
        request = new WebServices.HttpRequest(query);
        return request.promise;
    };
    Sdkzer.DEFAULT_HTTP_HEADERS = [];
    Sdkzer.HTTP_PATTERN = 'restful_crud';
    Sdkzer.PARENTS_FETCH_STRATEGY = 'none';
    Sdkzer.HTTP_QUERY_GUESS_CONFIG = {
        "restful_crud": {
            "read_collection": {
                verb: "GET",
                endpoint: '' },
            "read_record": {
                verb: "GET",
                endpoint: '' },
            "create_record": {
                verb: "GET",
                endpoint: '' },
            "update_record": {
                verb: "GET",
                endpoint: '' },
            "delete_record": {
                verb: "GET",
                endpoint: '' }
        }
    };
    return Sdkzer;
})();
Modularizer.defineModule('Sdkzer', Sdkzer);
