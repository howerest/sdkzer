/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/es6-promise/es6-promise.d.ts' />
/// <reference path='./howerest.webservices.ts' />
/// <reference path="./howerest.modularizer.ts"/>

/*!
 * Implements functionality to deal with restful http services
 * @params {attrs} Initial attributes
 */

class Sdkzer {

  public attrs:Object;
  public pAttrs:Object;
  public syncing:boolean = false;
  public lastResponse:WebServices.HttpResponse = null;

  // Configuration
  private static DEFAULT_HTTP_HEADERS:WebServices.HttpHeader[] = [];
  private static HTTP_PATTERN:String = 'restful_crud';
  private static PARENTS_FETCH_STRATEGY:String = 'none';
  private static HTTP_QUERY_GUESS_CONFIG:Object = {
    "restful_crud": {
      "read_collection" : {
        verb: "GET",
        endpoint: ''   },
      "read_record" :     {
        verb: "GET",
        endpoint: ''   },
      "create_record" :   {
        verb: "GET",
        endpoint: ''   },
      "update_record":    {
        verb: "GET",
        endpoint: ''   },
      "delete_record":    {
        verb: "GET",
        endpoint: ''   }
    }
  }


  public constructor(attrs:Object = {}) {
    this.attrs = { id: null };
    this.pAttrs = { id: null };

    this.setDefaults();

    for (var attrKey in attrs) {
      // Object initialization parameters are in force to default parameters
      this.attrs[attrKey] = attrs[attrKey];
      this.pAttrs[attrKey] = attrs[attrKey];
    }
  }

  /*!
   * Configure
   */
   public static configure(options:ISdkzerConfigOptions) {
     Sdkzer['DEFAULT_HTTP_HEADERS'] = options['defaultHttpHeaders'] ? options['defaultHttpHeaders'] : this['DEFAULT_HTTP_HEADERS'];
     Sdkzer['HTTP_PATTERN'] = options['httpPattern'] ? options['httpPattern'] : this['HTTP_PATTERN'];
     Sdkzer['PARENTS_FETCH_STRATEGY'] = options['parentsFetchStrategy'] ? options['parentsFetchStrategy'] : this['PARENTS_FETCH_STRATEGY'];
     Sdkzer['HTTP_QUERY_GUESS_CONFIG'] = options['httpQueryGuessConfig'] ? options['httpQueryGuessConfig'] : this['HTTP_QUERY_GUESS_CONFIG'];
   }


   /*!
    * Verifies if Sdkzer is using a restful CRUD http pattern
    */
   public static usingRestfulCrudHttpPattern() {
     return (Sdkzer['HTTP_PATTERN'] === 'restful_crud' ? true : false);
   }


   /*!
    * Verifies if Sdkzer is using a custom http pattern
    */
   public static usingCustomHttpPattern() {
     return (Sdkzer['HTTP_PATTERN'] !== 'restful_crud' ? true : false);
   }


   /*!
    * Verifies if Sdkzer is using any parents fetch strategy
    */
   public static usingParentsFetchStrategy() {
     return Sdkzer['PARENTS_FETCH_STRATEGY'] !== 'none' ? true : false;
   }


   /*!
    * Retrieves the http guess config for an specific crud operation
    */
   public static getHttpQueryGuessConfigFor(operation:String) {
     if (Sdkzer.usingRestfulHttpPattern()) {
       return Sdkzer['HTTP_QUERY_GUESS_CONFIG']['restful_crud'];
     } else {
       return Sdkzer['HTTP_QUERY_GUESS_CONFIG']['custom'];
     }
   }


  /*!
   * Sets the defaults for the entity
   */
  public setDefaults() {
    if (this.defaults()) {
      var defaults = this.defaults();
      for (var attrKey in defaults) {
        this.attrs[attrKey] = defaults[attrKey];
      }
    }
  }


  /*!
   * Retrieves the defaults for the entity
   */
  public defaults() {
    return {};
  }


  /*!
   * Retrieves the defaults for the entity
   */
   public attr(attrName?: string, value?: any) {
     // Setting an attribute?
     if (attrName !== undefined && value !== undefined) {
       // TODO: Add before&after-callbacks
       this.attrs[attrName] = value;
     } else if (attrName !== undefined && value === undefined) {
       // Reading an attribute?
       return this.attrs[attrName];
     } else {
       // Reading all attributes?
       // TODO: Add before&after-callbacks
       return this.attrs;
     }
   }


  /*!
   * Retrieves the resource endpoint url
   */
  public resourceEndpoint() {
    // TODO: This is the base endpoint, not the resource endpoint
    // TODO: Guess a resourceEndpoint based on a restful or custom http pattern
    return '';
  }


  /*!
   * Checks if the record is not saved on the origin
   */
  public isNew() {
    return (this.attrs['id'] !== null) ? false : true;
  }


  /*!
   * Checks if the record has changed since the last save
   */
  public hasChanged() {
    return this.changedAttrs().length > 0 ? true : false;
  }


  /*!
   * Checks if an attribute has changed from the origin
   */
  public hasAttrChanged(attrName:string) {
    var i, changedAttrs = this.changedAttrs();

    for (i = 0; i < changedAttrs.length; i++) {
      if (changedAttrs[i] === attrName) {
        return true;
      }
    }

    return false;
  }


  /*!
   * Retrieves the name of the changed attributes since the last save
   */
  public changedAttrs() {
    var changedAttrs = [],
        currAttrs = Object.keys(this['attrs']),
        prevAttrs = Object.keys(this['pAttrs']),
        i, i2;

    for (i=0; i <= currAttrs.length; i++) {
      for (i2=0; i2 <= prevAttrs.length; i2++) {
        if (currAttrs[i] !== null && currAttrs[i] === prevAttrs[i2] && this.attrs[currAttrs[i]] !== this.pAttrs[prevAttrs[i2]]) {
          changedAttrs.push(currAttrs[i]);
          break;
        }
      }
    }

    return changedAttrs;
  }


  /*!
   * Retrieves the previous attributes
   */
  public prevAttrs() {
    var previousAttrs = {};
    for (var attrKey in this.attrs) {
      if (this.pAttrs[attrKey] !== this.attrs[attrKey]) {
        previousAttrs[attrKey] = (this.pAttrs[attrKey] ? this.pAttrs[attrKey] : null);
      }
    }

    return previousAttrs;
  }


  /*!
   * Retrieves the previous value prior to last save for a specific attribute
   */
  public previousValue(attrName: String) {

  }


  /*!
   * Fetches
   */
  public fetch(origin?: String, camelize: Boolean = true, httpHeaders:WebServices.HttpHeader[] = []) {
    var _this = this,
        promise;

    if (this.attrs['id']) {
      this.syncing = true;

      var query = new WebServices.HttpQuery({
        httpMethod: "GET",
        endpoint:   this.resourceEndpoint() + '/' + this.attrs['id'],
        qsParams:   {},
        headers:    [],
        data:       {}
      });

      var request = new WebServices.HttpRequest(query);
      promise = request.promise;
      promise.then(
        // Success
        (response) => {
          console.log('Success!!');
          _this.syncing = false;
          var parsedData = _this.parse(response.data);

          if (camelize) {
            // parsedData = util.Camel.camelize(parsedData);
          }

          for(var attrKey in parsedData) {
            if (_this.attrs[attrKey] != parsedData[attrKey]) {
              // Keep track of previous attributes
              _this.pAttrs[attrKey] = parsedData[attrKey];
            }
          }
          _this.attrs = parsedData;
        },
        // Fail
        (response) => {
          console.log('failed with: ', response);
          _this.syncing = false;
        }
      );
    }

    if (typeof(promise === 'undefined')) {
      promise = new Promise((resolve, reject) => { });
      promise = request.promise = Promise.reject(false);
    }

    return promise;
  }


  /*!
   * Parses the data from an incoming HttpResponse
   */
  public parse(data:Object) {
    return data;
  }


  /*!
   * Transforms the local attributes to be processed by the origin in JSON format
   */
  public toOriginJSON() {
    return this.attrs;
  }


  /*!
   * Transforms the local attributes to be processed by the origin in XML format
   */
  public toOriginXML() {
    // TODO: Implement
  }


  /*!
   * Transforms the local attributes to be processed by the origin in a specific format
   */
  public toOrigin(format:string) {
    switch(format) {
      case 'json':
        this.toOriginJSON();
        break;
     case 'xml':
       this.toOriginXML();
       break;
    }

    return this.attrs;
  }


  /*!
   * Updates the local object into the origin
   */
  public update(httpHeaders:WebServices.HttpHeader[] = []) {
    var _this =  this,
        query,
        request;

    // Update tests
    if (Sdkzer.HTTP_PATTERN === 'restful-crud') {

    }

    if (this.hasChanged()) {
      query = new WebServices.HttpQuery({
        httpMethod: "PUT",
        endpoint:   this.resourceEndpoint()+'/'+this.attrs['id'],
        headers:    [],
        qsParams:   {},
        data:       {}
      });
      request = new WebServices.HttpRequest(query);

      return request.promise.then(
        // Success
        function(response) {
          _this.lastResponse = response;
        }
      );
    }
  }


  /*!
   * Destroys the current record in the origin
   */
  public destroy() {
    var query,
        request;

    query = new WebServices.HttpQuery({
      httpMethod: "DELETE",
      endpoint:   this.resourceEndpoint()+'/'+this.attrs['id'],
      qsParams:   {},
      headers:    [],
      data:       {}
    });
    request = new WebServices.HttpRequest(query);
  }


  /*!
   * Retrieves a collection of records from the origin
   */
  public static fetchIndex(httpQuery:WebServices.HttpQuery) {
    var query,
        request;

    // TODO: the endpont and verb

    query = new WebServices.HttpQuery({
      httpMethod: "GET",
      endpoint:   (new this().resourceEndpoint()),
      headers:    [],
      qsParams:   {},
      data:       {}
    });
    request = new WebServices.HttpRequest(query);

    return request.promise;
  }


  /*!
   * Retrieves a single record from the origin
   */
  public static fetchOne(id: Number, httpQuery?:WebServices.HttpQuery) {
    var model = new this(),
        query,
        request;

    if (typeof(httpQuery) === 'undefined') {
      query = new WebServices.HttpQuery({
        httpMethod: "GET",
        endpoint:   model.resourceEndpoint()+'/'+id,
        qsParams:   {},
        headers:    [],
        data:       {}
      });
    } else {
      query = httpQuery;
    }

    request = new WebServices.HttpRequest(query);
    return request.promise;
  }
}


interface ISdkzerConfigOptions {
  defaultHttpHeaders:String;
  httpPattern:String;
  parentsFetchStrategy:String;
  httpQueryGuessConfig:IHttpQueryGuessConfig;
}

interface IHttpQueryGuessConfig {
  restful:Object;
}

Modularizer.defineModule('Sdkzer', Sdkzer);
