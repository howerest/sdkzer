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
    Sdkzer.prototype.configure = function (options) {
        this['DEFAULT_HTTP_HEADERS'] = options['defaultHttpHeaders'] ? options['defaultHttpHeaders'] : this['DEFAULT_HTTP_HEADERS'];
        this['HTTP_PATTERN'] = options['httpPattern'] ? options['httpPattern'] : this['HTTP_PATTERN'];
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
            var request = new WebServices.HttpRequest(this.resourceEndpoint() + '/' + this.attrs['id'], "GET", httpHeaders);
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
        if (typeof (promise === 'undefined')) {
            promise = new Promise(function (resolve, reject) { });
            promise = request.promise = Promise.reject(false);
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
        var _this = this;
        if (this.hasChanged()) {
            var request = new WebServices.HttpRequest(this.resourceEndpoint() + '/' + this.attrs['id'], 'PUT', httpHeaders, {}, this.toOriginJSON());
            return request.promise.then(function (response) {
                _this.lastResponse = response;
            });
        }
    };
    Sdkzer.prototype.destroy = function () {
        var request = new WebServices.HttpRequest(this.resourceEndpoint() + '/' + this.attrs['id'], 'DELETE');
    };
    Sdkzer.fetchIndex = function (qsParams, httpHeaders) {
        if (httpHeaders === void 0) { httpHeaders = []; }
        var model = new this();
        var request = new WebServices.HttpRequest(model.resourceEndpoint(), "GET", httpHeaders);
        return request.promise;
    };
    Sdkzer.fetchOne = function (id, httpHeaders) {
        if (httpHeaders === void 0) { httpHeaders = []; }
        var model = new this();
        var request = new WebServices.HttpRequest(model.resourceEndpoint() + '/' + id, "GET", httpHeaders);
        return request.promise;
    };
    Sdkzer.DEFAULT_HTTP_HEADERS = [];
    Sdkzer.HTTP_PATTERN = 'restful-crud';
    return Sdkzer;
})();
Modularizer.defineModule('Sdkzer', Sdkzer);
