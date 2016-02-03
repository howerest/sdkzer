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
        function HttpRequest(httpQuery) {
            this.response = null;
            this.query = httpQuery;
            var _this = this;
            console.log('XMLHttpRequest: ', XMLHttpRequest());
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
        function HttpQuery(httpMethod, endpoint, qsParams, headers, data) {
            if (qsParams === void 0) { qsParams = {}; }
            if (headers === void 0) { headers = []; }
            this.httpMethod = 'GET';
            this.qsParams = {};
            this.headers = [];
            this.data = {};
            this.endpoint = endpoint;
            this.httpMethod = httpMethod;
            this.qsParams = qsParams;
            this.headers = headers;
            this.data = data;
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
