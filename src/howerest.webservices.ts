/// <reference path='./howerest.util.ts' />

/*
 * Implements the web services functionality
 */
module WebServices {

  declare const XDomainRequest: any;

  /*!
   * Handles a Http Header
   */
  export class HttpHeader {
    public name: string;
    public value: string;

    constructor(header:Object) {
      this.name = Object.keys(header)[0];
      this.value = header[Object.keys(header)[0]];
    }
  }

  /*!
   * Handles a Http Request
   */
  export class HttpRequest {
    client: any;
    query:WebServices.HttpQuery;
    response: HttpResponse = null
    promise: Promise<any>

    constructor(httpQuery:WebServices.HttpQuery) {
      this.query = httpQuery;
      var _this = this

      if (Util.EnvChecker.isBrowser()) {
        console.log('Im in a browser');
        if (typeof(XMLHttpRequest) !== 'undefined') {
          this.client = new XMLHttpRequest();
        } else if (typeof(XDomainRequest) !== 'undefined') {
          this.client = new XDomainRequest();
        } else {
          return;
        }
      } else if (Util.EnvChecker.isNode()){
        console.log('Im in Node.js');
        var XMLHttpRequest = require('xhr2');
        this.client = new XMLHttpRequest();
      } else {
        return;
      }

      // Set method & url
      this.client.open(this.query.httpMethod, this.query.endpoint);

      // Set headers
      for (var headerKey in this.query.headers) {
        this.client.setRequestHeader(headerKey, this.query.headers[headerKey]);
      }
      this.client.setRequestHeader('Accept', 'application/json');
      // Promise
      this.promise = new Promise(function(resolve, reject) {
        // Resolve a HttpResponse when success
        this.client.onreadystatechange = function(e) {
          if (e && e.target['readyState'] == 4) {
            if (e.target['status'] == 200) {
              _this.response = new HttpResponse(this.endpoint, {}, e.target['responseText']);
              resolve(_this.response);
            }
          } else {
            this.promise = Promise.reject(false);
          }
        };
      });

      this.client.send(this.query.data ? JSON.stringify(this.query.data) : null);
    }
  }


  /*
   * Handles a Http Response
   */
  export class HttpResponse {
    data:Object
    constructor(baseHost: String, headers: Object, data: string, parseJSON: boolean = true) {
      this.data = Object.keys(data).length > 0 ? JSON.parse(data) : {};
    }
  }


  /*
   *  Implements an API to build HTTP queries
   *
   *  Code sample of usage:
   *
   *    var query = new HttpQuery();
   *    query.where({ name: "David" });
   *
   *    if (loggedIn()) {
   *      query.where({ user_id: user.id });
   *    }
   *
   *    User.fetchAll(query)
   */
  export class HttpQuery {
    public endpoint:string;
    public httpMethod:string = 'GET';
    public qsParams:Object = {};
    public headers:WebServices.HttpHeader[] = [];
    public data:Object = {};

    constructor(querySettings: IHttpQuerySettings) {
      this.endpoint = querySettings.endpoint
      this.httpMethod = querySettings.httpMethod
      this.qsParams = querySettings.qsParams;
      this.headers = querySettings.headers;
      this.data = querySettings.data;
    }


    /*!
     *  Implements a Http Querier API to modify the query
     *  Query String parameters are right way to query an restful http resource
     */
    public where(qsParams:Object = this.qsParams) {

      // qs:
      // headers:
      // data:

      for (var key in qsParams) {
        if (qsParams.hasOwnProperty(key)) {
          this.qsParams[key] = qsParams[key];
        }
      }

      return this;
    }


    /*!
     *  Sets a list of HttpHeaders for the HttpQuery
     */
    public withHeaders(headers:WebServices.HttpHeader[] = []) {
      this.headers = headers;
    }


    /*!
     *  Sets the data for the HttpQuery
     */
    public withData(data:Object = {}) {
      this.data = data;
    }


    /*
     *  Returns the HttpQuery query string in string format (URI encoded)
     */
     public qsParamsToString(qsParams:Object = this.qsParams) {
       return this.serialize(qsParams);
     }


    /*
     *  Serialize
     */
     private serialize(obj:Object) {
       var items = [];

       for(var key in obj) {
         var k = key, value = obj[key];
         items.push(typeof(value) === "object" ? this.serialize(value) : encodeURIComponent(key) + "=" + encodeURIComponent(value));
       }

       return items.join("&");
     }
  }


  export interface IHttpQuerySettings {
    endpoint: string
    httpMethod: string
    qsParams: Object
    headers: WebServices.HttpHeader[]
    data: Object
  }
}
