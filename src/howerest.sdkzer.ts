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

export interface SdkzerParams {
  id: any
}

export class Sdkzer<T extends SdkzerParams> {

  public attrs:T;
  public pAttrs:T;
  protected validationRules:object;
  public invalidMessages:object = {};
  public syncing:boolean = false;
  public lastResponse:Response|null = null;

  // Configuration
  private static DEFAULT_HTTP_HEADERS:THttpHeaders = {};
  private static PARENTS_FETCH_STRATEGY:string = 'none';

  /**
   * Creates an instance of a model entity with an API to communicate with
   * a resource (http RESTful resource)
   * @param  {object}   attrs   The initial attributes for the resource.
   *                            Those attributes are in force to defaults()
   */
  public constructor(attrs:T = {} as T) {
    this.attrs = { id: null } as T;
    this.pAttrs = { id: null } as T;

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
   public static configure(options:ISdkzerConfigOptions) : void {
    Sdkzer.DEFAULT_HTTP_HEADERS = options.defaultHttpHeaders || {};
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
  public defaults() : object {
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
    // Reset previous invalid messages from previous validations
    this.invalidMessages = {};
    let toValidateAttr, validationRule;
    const toValidateAttrs = Object.keys(this.validationRules || {});

    // Validate attribute's ValidationRules
    for(toValidateAttr of toValidateAttrs) {
      for(validationRule of this.validationRules[toValidateAttr]) {
        // When the ValidationRule is invalid...
        if (!validationRule.isValid(this.pAttrs[toValidateAttr], this.attrs[toValidateAttr])) {
          if (!this.invalidMessages[toValidateAttr]) {
            this.invalidMessages[toValidateAttr] = [];
          }
          // Collect the invalid message from the ValidationRules for that field
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
   public attr(attrName?: string, value?: any) : string | number | boolean | object {
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
  public baseEndpoint() : string {
    return null;
  }


  /**
   * Retrieves the resource url
   * NOTE: This method will become the interface to connect using different
   * http patterns
   */
  public resourceEndpoint() : string {
    return '';
  }


  /**
   * Checks if the record is not saved in the origin. An record will be
   * consiered new when it has an "id" attribute set to null and it lacks of
   * a "lastResponse" attribute value
   */
  public isNew() : boolean {
    return ((this.attrs.id !== null) ? false : true);
  }


  /**
   * Checks if the record has changed since the last save
   */
  public hasChanged() : boolean {
    return (this.changedAttrs().length > 0 ? true : false);
  }


  /**
   * Checks if an attribute has changed from the origin
   */
  public hasAttrChanged(attrName:string) : boolean {
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
  public changedAttrs() : Array<string> {
    let changedAttrs = [],
        currAttrs = Object.keys(this.attrs),
        prevAttrs = Object.keys(this.pAttrs),
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
  public prevAttrs() : T {
    let previousAttrs = {} as T;
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
  public async fetch(httpQuery?:IQuery, camelize: boolean = true) : Promise<Response> {
    let _this = this,
        promise;

    if (this.attrs.id) {
      this.syncing = true;

      let query:IQuery = {
        url:        `${this.baseEndpoint()}/${this.attrs.id}`,
        method:     'GET',
        headers:    Sdkzer.DEFAULT_HTTP_HEADERS || {},
        qsParams:   {},
        data:       {}
      }

      if (typeof(httpQuery) !== 'undefined') {
        query = {
          ...query,
          ...httpQuery
        };
      }
      
      try {
        let response = await fetch(`${query.url}${query.qsParams ? qsToString(query.qsParams): ''}`, {
          method: query.method,
          headers: query.headers,
          body: query.data.toString()
        });
        // Success
        _this.syncing = false;
        // TODO: Keep lastResponse
        let parsedData = _this.parseRecord(JSON.parse(await response.json()));
        if (camelize) {
          // parsedData = util.Camel.camelize(parsedData);
        }
        // Keep track of previous attributes
        _this.pAttrs = parsedData;
        // Assign the parsed attributes
        _this.attrs = parsedData;
        return response;
      } catch(e) {
        // Fail
        _this.syncing = false;
        return Promise.reject(false);
      }
    }
  }


  /**
   * Parses a single resource record from an incoming HttpResponse data
   * NOTE: The idea is to return the parsed record data only
   */
  public parseRecord(data:object, prefix?:string) : T {
    return prefix ? data[prefix] : data;
  }


  /**
   * Parses a collection of resource records from an incoming HttpResponse data
   * NOTE: The idea is to return the parsed collection of records data only
   */
  public static parseCollection(data:Array<object>, prefix?:string) : Array<object> {
    return prefix ? data[prefix] : data;
  }


  /**
   * Transforms the local attributes to be processed by the origin in JSON format
   */
  public toOriginJSON() : object {
    return this.attrs;
  }


  /**
   * Transforms the local attributes to be processed by the origin in XML format
   */
  public toOriginXML() : string {
    return '';
  }


  /**
   * Transforms the local attributes to be processed by the origin in a specific format
   * @param format The format to transform into
   */
  public toOrigin(format:string = 'json') : object|string {
    let snapshot;

    switch(format) {
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
  public async save(httpHeaders:THttpHeaders = {}) : Promise<Response> {
    let _this =  this,
        query:IQuery,
        request,
        httpMethod:THttpMethod = (this.attr('id') == null ? 'POST' : 'PUT');

    // New record in the origin?
    if (httpMethod === 'POST') {
      query = {
        method:     httpMethod,
        url:        this.baseEndpoint(),
        headers:    Sdkzer.DEFAULT_HTTP_HEADERS || {},
        qsParams:   {},
        data:       this.toOriginJSON()
      };

    // Existing record in the origin?
    } else {
      query = {
        method:     httpMethod,
        url:        `${this.baseEndpoint()}/${this.attrs.id}${query && query.qsParams ? qsToString(query.qsParams): ''}`,
        headers:    Sdkzer.DEFAULT_HTTP_HEADERS || {},
        qsParams:   {},
        data:       this.toOriginJSON()
      };
    }

    try {
      const response = await fetch(query.url, {
        method: query.method,
        headers: query.headers,
        body: query.data.toString()
      });
      if (httpMethod === 'POST') {
        // Append id to attributes
        _this.attrs.id = (await response.json())['id'];
      }
      _this.lastResponse = response;
      return response;
    } catch(e) {
      return Promise.reject(false);
    }
  }


  /**
   * Destroys the current record in the origin
   */
  public async destroy() : Promise<Response> {
    let query:IQuery;

    query = {
      method:     'DELETE',
      url:        `${this.baseEndpoint()}/${this.attrs.id}`,
      headers:    Sdkzer.DEFAULT_HTTP_HEADERS || {},
      qsParams:   {},
      data:       {}
    };

    try {
      return await fetch(query.url, {
        method: query.method,
        headers: query.headers,
        body: query.data.toString()
      })
    } catch(e) {
      return Promise.reject(false);
    }
  }


  /**
   * Retrieves a collection of records from the origin
   * @param httpQuery An optional query to be merged with the default one 
   */
  public static async fetchIndex(httpQuery?:IQuery) : Promise<Array<any>> {
    let query:IQuery,
        request,
        instancesPromise,
        instances = [],
        instance;

    instancesPromise = new Promise(async (resolve, reject) => {
      query = {
        method:     'GET',
        url:        `${new this().baseEndpoint()}${httpQuery && httpQuery.qsParams ? qsToString(httpQuery.qsParams): ''}`,
        headers:    Sdkzer.DEFAULT_HTTP_HEADERS || {},
        qsParams:   {}
      };

      if (typeof(httpQuery) !== 'undefined') {
        query = {
          ...query,
          ...httpQuery
        };
      }

      try {
        const response = await fetch(query.url, {
          method: query.method,
          headers: query.headers
        });
        const collectionList = this.parseCollection(JSON.parse(await response.json()));
        for (let i in collectionList) {
          instance = new this();
          instance.attrs = instance.pAttrs = instance.parseRecord(collectionList[i]);
          instances.push(instance);
        }
        resolve(instances);
      } catch(e) {
        reject(e);
      }
    });

    return instancesPromise;
  }


  /**
   * Retrieves a single record from the origin
   * @param id          The record id that we want to fetch by
   * @param httpQuery   Use a HttpQuery instance to override the default query
   */
  public static fetchOne(id: number|string, httpQuery?:IQuery) : Promise<any>  {
    let model = new this(),
        query:IQuery,
        instancePromise,
        instance;

    instancePromise = new Promise(async (resolve, reject) => {
      query = {
        method:     'GET',
        url:        `${model.baseEndpoint()}/${id}${httpQuery && httpQuery.qsParams ? qsToString(httpQuery.qsParams) : ''}`,
        headers:    Sdkzer.DEFAULT_HTTP_HEADERS || {},
        qsParams:   {}
      };

      if (typeof(httpQuery) !== 'undefined') {
        query = {
          ...query,
          ...httpQuery
        }
      }

      try {
        const response = await fetch(query.url, {
          method: query.method,
          headers: query.headers
        })
        instance = new this();
        instance.attrs = instance.pAttrs = instance.parseRecord(JSON.parse(await response.json()));
        resolve(instance);
      } catch(e) {
        reject(e);
      }
    });
    return instancePromise;
  }
}

function qsToString(qs:IQueryString) {
  let qsPart = '';
  // Add query string to url
  if (Object.keys(qs).length > 0) {
    qsPart += '?';
    let i=0;
    let keys = Object.keys(qs);
    for(let key of keys) {
      if (i > 0) { qsPart += '&'; }
      qsPart += `${key}=${qs[key]}`;
      i++;
    }
  }
  return qsPart;
}

export type THttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type THttpHeaders = {
  [key:string] : string
}
export interface IQueryString {
  [key:string] : string | number
}

export interface IQuery {
  url?:        string,
  method?:     THttpMethod,
  headers?:    THttpHeaders,
  qsParams?:   IQueryString,
  data?:       {}
}

export interface ISdkzerConfigOptions {
  defaultHttpHeaders: THttpHeaders
}

export { ValidationRule } from "./validation_rule";
export { RequiredValidator } from "./validation_rules/required_validator"
export {
  RegExpValidator,
  IParams as IRegExpValidatorParams
} from "./validation_rules/reg_exp_validator"
export {
  NumberValidator,
  IParams as INumberValidatorParams
} from "./validation_rules/number_validator"
export {
  LengthValidator,
  IParams as ILengthValidatorParams
} from "./validation_rules/length_validator"
export { EmailValidator } from "./validation_rules/email_validator"
export {
  AllowedValueSwitchValidator,
  IParams as IAllowedValueSwitchValidatorParams
} from "./validation_rules/allowed_value_switch_validator"
