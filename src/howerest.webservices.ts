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
    name: string;
    value: string;

    constructor(name: string, value: string) {
      this.name = name;
      this.value = value;
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

      console.log('XMLHttpRequest: ', XMLHttpRequest());

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
      this.client.open(this.httpMethod, this.endpoint);

      // Set headers
      for (var headerKey in this.httpHeaders) {
        this.client.setRequestHeader(headerKey, this.httpHeaders[headerKey]);
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

      this.client.send(data ? JSON.stringify(data) : null);
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

    constructor(httpMethod: string, endpoint: string, qsParams:Object = {}, headers:WebServices.HttpHeader[] = [], data?:Object) {
      this.endpoint = endpoint
      this.httpMethod = httpMethod
      this.qsParams = qsParams;
      this.headers = headers;
      this.data = data;
    }


    /*
    *  Implements a Http Querier API to modify the query
    */
    public where(qsParams:Object = this.qsParams) {
      for (var key in qsParams) {
        if (qsParams.hasOwnProperty(key)) {
          this.qsParams[key] = qsParams[key];
        }
      }

       return this;
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
}
