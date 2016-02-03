var WebServices;
(function (WebServices) {
    var HttpHeader = (function () {
        function HttpHeader(name, value) {
            this.name = name;
            this.value = value;
        }
        return HttpHeader;
    })();
    WebServices.HttpHeader = HttpHeader;
    var HttpRequest = (function () {
        function HttpRequest(endpoint, httpMethod, httpHeaders, qsParams, data) {
            if (httpHeaders === void 0) { httpHeaders = []; }
            this.qsParams = {};
            this.data = {};
            this.response = null;
            this.endpoint = endpoint;
            this.httpMethod = httpMethod;
            this.httpHeaders = httpHeaders;
            this.qsParams = qsParams;
            this.data = data;
            var _this = this;
            if (Util.EnvChecker.isBrowser()) {
                if (typeof (XMLHttpRequest) !== 'undefined') {
                    this.client = new XMLHttpRequest();
                }
                else if (typeof (XDomainRequest) !== 'undefined') {
                    this.client = new XDomainRequest();
                }
                else {
                    return;
                }
            }
            else if (Util.EnvChecker.isNode()) {
                var XMLHttpRequest = require('xhr2');
                this.client = new XMLHttpRequest();
            }
            else {
                return;
            }
            this.client.open(this.httpMethod, this.endpoint);
            for (var headerKey in this.httpHeaders) {
                this.client.setRequestHeader(headerKey, this.httpHeaders[headerKey]);
            }
            this.client.setRequestHeader('Accept', 'application/json');
            this.promise = new Promise(function (resolve, reject) {
                this.client.onreadystatechange = function (e) {
                    if (e && e.target['readyState'] == 4) {
                        if (e.target['status'] == 200) {
                            _this.response = new HttpResponse(this.endpoint, {}, e.target['responseText']);
                            resolve(_this.response);
                        }
                    }
                    else {
                        this.promise = Promise.reject(false);
                    }
                };
            });
            this.client.send(data ? JSON.stringify(data) : null);
        }
        return HttpRequest;
    })();
    WebServices.HttpRequest = HttpRequest;
    var HttpResponse = (function () {
        function HttpResponse(baseHost, headers, data, parseJSON) {
            if (parseJSON === void 0) { parseJSON = true; }
            this.data = Object.keys(data).length > 0 ? JSON.parse(data) : {};
        }
        return HttpResponse;
    })();
    WebServices.HttpResponse = HttpResponse;
    var HttpQuery = (function () {
        function HttpQuery(qsParams, headers) {
            if (qsParams === void 0) { qsParams = {}; }
            this.qsParams = qsParams;
            this.headers = headers;
        }
        HttpQuery.prototype.where = function (qsParams) {
            for (var key in qsParams) {
                if (qsParams.hasOwnProperty(key)) {
                    this.qsParams[key] = qsParams[key];
                }
            }
            return this;
        };
        HttpQuery.prototype.qsParamsToString = function (qsParams) {
            if (qsParams === void 0) { qsParams = this.qsParams; }
            return this.serialize(qsParams);
        };
        HttpQuery.prototype.serialize = function (obj) {
            var items = [];
            for (var key in obj) {
                var k = key, value = obj[key];
                items.push(typeof (value) === "object" ? this.serialize(value) : encodeURIComponent(key) + "=" + encodeURIComponent(value));
            }
            return items.join("&");
        };
        return HttpQuery;
    })();
    WebServices.HttpQuery = HttpQuery;
})(WebServices || (WebServices = {}));
