/* --------------------------------------------------------------------------

    howerest 2018 - <hola@davidvalin.com> | www.howerest.com

    Apache 2.0 Licensed
    -------------------

    Implements a standarized & friendly API to deal with RESTful http resources
    that implement endpoints to perform the CRUD operations

    1. Define a resource:
    2. Start consuming your resource

--------------------------------------------------------------------------- */

import { WebServices } from "js-webservices";
import { ValidationRule } from "./validation_rule";

export class Sdkzer {

  private attrs:Object;
  private pAttrs:Object;
  private validationRules:Object;
  private invalidMessages:Object = {};
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


  /**
   * Creates an instance of a model entity with an API to communicate with
   * a resource (http RESTful resource)
   * @param  {Object}   attrs   The initial attributes for the resource.
   *                            Those attributes are in force to defaults()
   */
  public constructor(attrs:Object = {}) {
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
   * @param options {ISdkzerConfigOptions} The configuration options
   */
   public static configure(options:ISdkzerConfigOptions) : void {
     if (options['defaultHttpHeaders']) {
       Sdkzer['DEFAULT_HTTP_HEADERS'] = [];
       for (let i = 0; i < options['defaultHttpHeaders'].length; i++) {
         Sdkzer['DEFAULT_HTTP_HEADERS'].push(new WebServices.HttpHeader(options['defaultHttpHeaders'][i]));
       }
     }
     // Sdkzer['HTTP_PATTERN'] = options['httpPattern'] ? options['httpPattern'] : this['HTTP_PATTERN'];
     // Sdkzer['PARENTS_FETCH_STRATEGY'] = options['parentsFetchStrategy'] ? options['parentsFetchStrategy'] : this['PARENTS_FETCH_STRATEGY'];
     // Sdkzer['HTTP_QUERY_GUESS_CONFIG'] = options['httpQueryGuessConfig'] ? options['httpQueryGuessConfig'] : this['HTTP_QUERY_GUESS_CONFIG'];
   }


   /**
    * Checks if Sdkzer has been configured to communicate to RESTful resources
    */
   private static usingRestfulCrudHttpPattern() : Boolean {
     return (Sdkzer['HTTP_PATTERN'] === 'restful_crud' ? true : false);
   }


   /**
    * Checks if Sdkzer has been configured to communicate using custom CRUD endpoints
    */
   private static usingCustomHttpPattern() : Boolean {
     return (Sdkzer['HTTP_PATTERN'] !== 'restful_crud' ? true : false);
   }


   /**
    * Checks if Sdkzer is using any fetch strategy once received parent ids
    */
   private static usingParentsFetchStrategy() : Boolean {
     return Sdkzer['PARENTS_FETCH_STRATEGY'] !== 'none' ? true : false;
   }


   /**
    * Retrieves the http guess config for an specific CRUD operation.
    * @param {String} operation  Accepts "create", "read", "update" and "delete"
    */
   private static getHttpQueryGuessConfigFor(operation:String) : Object {
     if (Sdkzer.usingRestfulCrudHttpPattern()) {
       return Sdkzer['HTTP_QUERY_GUESS_CONFIG']['restful_crud'];
     } else {
       return Sdkzer['HTTP_QUERY_GUESS_CONFIG']['custom'];
     }
   }


  /**
   * Sets the defaults() values in the instance attributes
   */
  public setDefaults() : void {
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
  public defaults() : Object {
    return {};
  }

  /**
   * Checks wether an entity is a valid entity.
   * It doesn't perform validation (check validate())
   */
  public isValid() : boolean {
    const attrs = Object.keys(this.invalidMessages);
    for(const attrName of attrs) {
      if (this.invalidMessages[attrName] && this.invalidMessages[attrName].length > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks wether an entity is a valid entity
   */
  public validate() : void {
    let isValid = true, toValidateAttr, validationRule;
    const toValidateAttrs = Object.keys(this.validationRules);

    // Validate attribute's ValidationRules
    for(toValidateAttr of toValidateAttrs) {
      for(validationRule of this.validationRules[toValidateAttr]) {
        if (!validationRule.isValid(this.pAttrs[toValidateAttr], this.attrs[toValidateAttr])) {
          if (!this.invalidMessages[toValidateAttr]) {
            this.invalidMessages[toValidateAttr] = [];
          }
          this.invalidMessages[toValidateAttr].push(validationRule.invalidMessage);
        } else {
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
   public attr(attrName?: string, value?: any) : Object|void {
     // Setting an attribute?
     if (attrName !== undefined && value !== undefined) {
       // TODO: Add before&after-callback
       let attrKeys = attrName.split('.');
       let attrKeyName = '';
       eval("this.attrs['"+attrKeys.join("']['")+"'] = " + (typeof(value) === 'string' ? "'"+value+"'" : value));
     } else if (attrName !== undefined && value === undefined) {
       // Reading an attribute?
       let attrKeys = attrName.split('.');
       let attrValue = this.attrs[attrName.split('.')[0]];
       for (let i = 1; i < attrKeys.length; i++) {
         attrValue = attrValue[attrKeys[i]];
       }
       return attrValue;
     } else {
       // Reading all attributes?
       // TODO: Add before&after-callbacks
       return this.attrs;
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
  public baseEndpoint() : string {

    return null;
  }


  /**
   * Retrieves the resource url
   * NOTE: This method will become the interface to connect using different
   * http patterns
   */
  public resourceEndpoint() : String {
    return '';
  }


  /**
   * Checks if the record is not saved in the origin. An record will be
   * consiered new when it has an "id" attribute set to null and it lacks of
   * a "lastResponse" attribute value
   */
  public isNew() : Boolean {
    return ((this.attrs['id'] !== null && this.lastResponse !== null) ? false : true);
  }


  /**
   * Checks if the record has changed since the last save
   */
  public hasChanged() : Boolean {
    return (this.changedAttrs().length > 0 ? true : false);
  }


  /**
   * Checks if an attribute has changed from the origin
   */
  public hasAttrChanged(attrName:string) : Boolean {
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
  public changedAttrs() : Array<String> {
    let changedAttrs = [],
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


  /**
   * Retrieves the previous attributes
   */
  public prevAttrs() : Object {
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
  public prevValue(attrName:string) : any {
    return this.prevAttrs()[attrName];
  }


  /**
   * Fetches the newest attributes from the origin.
   */
  public fetch(httpQuery?:WebServices.HttpQuery, camelize: Boolean = true) : Promise<WebServices.HttpResponse> {
    let _this = this,
        promise;

    if (this.attrs['id']) {
      this.syncing = true;

      let query = new WebServices.HttpQuery({
        httpMethod: "GET",
        endpoint:   this.baseEndpoint() + '/' + this.attrs['id'],
        headers:    Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
        qsParams:   {},
        data:       {}
      });

      if (typeof(httpQuery) !== 'undefined') {
        query = WebServices.Merger.mergeHttpQueries([ query, httpQuery ]);
      }

      let request = new WebServices.HttpRequest(query);
      promise = request.promise;
      promise.then(
        // Success
        (response) => {
          _this.syncing = false;

          // TODO: Keep lastResponse
          let parsedData = _this.$parse(response.data);

          if (camelize) {
            // parsedData = util.Camel.camelize(parsedData);
          }
          // Keep track of previous attributes
          _this.pAttrs = parsedData;
          // Assign the parsed attributes
          _this.attrs = parsedData;
        },
        // Fail
        (response) => {
          _this.syncing = false;
        }
      );
    }

    if (typeof(promise) === 'undefined') {
      promise = Promise.reject(false);
    }

    return promise;
  }


  /**
   * Parses the resources data from an incoming HttpResponse
   * The idea is to return the resources attributes exclusively
   */
  public $parse(data:Object, dataPrefixKey?:string) : Object {
    if (dataPrefixKey !== null && data[dataPrefixKey]) {
      return data[dataPrefixKey];
    } else {
      return data;
    }
  }


  /**
   * Transforms the local attributes to be processed by the origin in JSON format
   */
  public toOriginJSON() : Object {
    return this.attrs;
  }


  /**
   * Transforms the local attributes to be processed by the origin in XML format
   */
  public toOriginXML() : String {
    // TODO: Implement
    return '';
  }


  /**
   * Transforms the local attributes to be processed by the origin in a specific format
   */
  public toOrigin(format:string) : Object|String {
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


  /**
   * Saves the local object into the origin
   */
  public save(httpHeaders:WebServices.HttpHeader[] = []) : Promise<WebServices.HttpResponse> {
    let _this =  this,
        query,
        request,
        httpMethod = (this.attr('id') == null ? "POST" : "PUT");

    // New record in the origin?
    if (httpMethod=="POST") {
      query = new WebServices.HttpQuery({
        httpMethod: httpMethod,
        endpoint:   this.baseEndpoint(),
        headers:    Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
        qsParams:   {},
        data:       this.toOriginJSON()
      });

    // Existing record in the origin?
    } else {
      query = new WebServices.HttpQuery({
        httpMethod: httpMethod,
        endpoint:   this.baseEndpoint()+'/'+this.attrs['id'],
        headers:    Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
        qsParams:   {},
        data:       this.toOriginJSON()
      });
    }

    request = new WebServices.HttpRequest(query);
    return request.promise.then(
      // Success
      (response) => {
        if (httpMethod=="POST") {
          // Append id to attributes
          _this.attrs['id'] = response.data['id'];
        }
        _this.lastResponse = response;
      }
    );
  }


  /**
   * Destroys the current record in the origin
   */
  public destroy() : Promise<any> {
    let query,
        request;

    query = new WebServices.HttpQuery({
      httpMethod: "DELETE",
      endpoint:   this.baseEndpoint()+'/'+this.attrs['id'],
      headers:    Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
      qsParams:   {},
      data:       {}
    });
    request = new WebServices.HttpRequest(query);
    return request.promise;
  }


  /**
   * Retrieves a collection of records from the origin
   */
  public static fetchIndex(httpQuery?:WebServices.HttpQuery) : Promise<Array<any>> {
    let query,
        request,
        instancesPromise,
        instances = [],
        instance;

    instancesPromise = new Promise((resolve, reject) => {
      query = new WebServices.HttpQuery({
        httpMethod: "GET",
        endpoint:   (new this().baseEndpoint()),
        headers:    Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
        qsParams:   {},
        data:       {}
      });

      if (typeof(httpQuery) !== 'undefined') {
        query = WebServices.Merger.mergeHttpQueries([ query, httpQuery ]);
      }

      request = new WebServices.HttpRequest(query);
      request.promise.then((response) => {
        for(let i in response.data) {
          instance = new this();
          instance.attrs = instance.pAttrs = instance.$parse(response.data[i]);
          instances.push(instance);
        }
        resolve(instances);
      }, (error) => {
        reject(error);
      });
    });

    return instancesPromise;
  }


  /**
   * Retrieves a single record from the origin
   * @param id          The record id that we want to fetch by
   * @param httpQuery   Use a HttpQuery instance to override the default query
   */
  public static fetchOne(id: Number, httpQuery?:WebServices.HttpQuery) : Promise<any>  {
    let model = new this(),
        query,
        request,
        instancePromise,
        instance;

    instancePromise = new Promise((resolve, reject) => {
      query = new WebServices.HttpQuery({
        httpMethod: "GET",
        endpoint:   model.baseEndpoint()+'/'+id,
        headers:    Sdkzer.DEFAULT_HTTP_HEADERS ? Sdkzer.DEFAULT_HTTP_HEADERS : [],
        qsParams:   {},
        data:       {}
      });

      if (typeof(httpQuery) !== 'undefined') {
        query = WebServices.Merger.mergeHttpQueries([ query, httpQuery ]);
      }

      request = new WebServices.HttpRequest(query);
      request.promise.then((response) => {
        instance = new this();
        instance.attrs = instance.pAttrs = instance.$parse(response.data);
        resolve(instance);
      }, (error) => {
        reject(error);
      });
    });
    return instancePromise;
  }
}

export interface ISdkzerConfigOptions {
  defaultHttpHeaders:string;
  // httpPattern?:String;
  // parentsFetchStrategy?:String;
  // httpQueryGuessConfig?:IHttpQueryGuessConfig;
}

export interface IHttpQueryGuessConfig {
  restful:Object;
}
