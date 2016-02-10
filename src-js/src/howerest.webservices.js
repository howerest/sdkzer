var WebServices;
(function (WebServices) {
    var HttpHeader = (function () {
        function HttpHeader(header) {
            this.name = Object.keys(header)[0];
            this.value = header[Object.keys(header)[0]];
        }
        return HttpHeader;
    })();
    WebServices.HttpHeader = HttpHeader;
    var HttpRequest = (function () {
        function HttpRequest(httpQuery) {
            this.response = null;
            this.query = httpQuery;
            var _this = this;
            if (Util.EnvChecker.isBrowser()) {
                console.log('Im in a browser');
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
                console.log('Im in Node.js');
                var XMLHttpRequest = require('xhr2');
                this.client = new XMLHttpRequest();
            }
            else {
                return;
            }
            this.client.open(this.query.httpMethod, this.query.endpoint);
            for (var headerKey in this.query.headers) {
                this.client.setRequestHeader(headerKey, this.query.headers[headerKey]);
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
                        _this.promise = Promise.reject(false);
                        resolve({});
                    }
                };
            });
            this.client.send(this.query.data ? JSON.stringify(this.query.data) : null);
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
        function HttpQuery(querySettings) {
            this.httpMethod = 'GET';
            this.qsParams = {};
            this.headers = [];
            this.data = {};
            this.endpoint = querySettings.endpoint;
            this.httpMethod = querySettings.httpMethod;
            this.qsParams = querySettings.qsParams;
            this.headers = querySettings.headers;
            this.data = querySettings.data;
        }
        HttpQuery.prototype.where = function (qsParams) {
            if (qsParams === void 0) { qsParams = this.qsParams; }
            for (var key in qsParams) {
                if (qsParams.hasOwnProperty(key)) {
                    this.qsParams[key] = qsParams[key];
                }
            }
            return this;
        };
        HttpQuery.prototype.withHeaders = function (headers) {
            if (headers === void 0) { headers = []; }
            this.headers = headers;
        };
        HttpQuery.prototype.withData = function (data) {
            if (data === void 0) { data = {}; }
            this.data = data;
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
