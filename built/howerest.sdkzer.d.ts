import { WebServices } from "js-webservices";
export declare class Sdkzer {
    private attrs;
    private pAttrs;
    private validationRules;
    private invalidMessages;
    syncing: boolean;
    lastResponse: WebServices.HttpResponse;
    private static DEFAULT_HTTP_HEADERS;
    private static HTTP_PATTERN;
    private static PARENTS_FETCH_STRATEGY;
    private static HTTP_QUERY_GUESS_CONFIG;
    /**
     * Creates an instance of a model entity with an API to communicate with
     * a resource (http RESTful resource)
     * @param  {Object}   attrs   The initial attributes for the resource.
     *                            Those attributes are in force to defaults()
     */
    constructor(attrs?: Object);
    /**
     * Configures Sdkzer constants that determine the behaviour of Sdkzer in all
     * classes that extend from Sdkzer in the current scope.
     * @param options {ISdkzerConfigOptions} The configuration options
     */
    static configure(options: ISdkzerConfigOptions): void;
    /**
     * Checks if Sdkzer has been configured to communicate to RESTful resources
     */
    private static usingRestfulCrudHttpPattern();
    /**
     * Checks if Sdkzer has been configured to communicate using custom CRUD endpoints
     */
    private static usingCustomHttpPattern();
    /**
     * Checks if Sdkzer is using any fetch strategy once received parent ids
     */
    private static usingParentsFetchStrategy();
    /**
     * Retrieves the http guess config for an specific CRUD operation.
     * @param {String} operation  Accepts "create", "read", "update" and "delete"
     */
    private static getHttpQueryGuessConfigFor(operation);
    /**
     * Sets the defaults() values in the instance attributes
     */
    setDefaults(): void;
    /**
     * Retrieves the defaults for the entity. Override it using your default
     * attributes if you need any
     */
    defaults(): Object;
    /**
     * Checks wether an entity is a valid entity.
     * It doesn't perform validation (check validate())
     */
    isValid(): boolean;
    /**
     * Checks wether an entity is a valid entity
     */
    validate(): void;
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
    attr(attrName?: string, value?: any): Object | void;
    /**
     * Retrieves the base resource url. Override it using your base endpoint
     * for your resource.
     *
     * NOTE: You need to define a baseEndpoint method in your entities
     *  in order to be able to sync with a backend endpoint
     *  A base endpoint for a RESTful endpoint look like:
     *    return "https://www.an-api.com/v1/users"
     */
    baseEndpoint(): string;
    /**
     * Retrieves the resource url
     * NOTE: This method will become the interface to connect using different
     * http patterns
     */
    resourceEndpoint(): String;
    /**
     * Checks if the record is not saved in the origin. An record will be
     * consiered new when it has an "id" attribute set to null and it lacks of
     * a "lastResponse" attribute value
     */
    isNew(): Boolean;
    /**
     * Checks if the record has changed since the last save
     */
    hasChanged(): Boolean;
    /**
     * Checks if an attribute has changed from the origin
     */
    hasAttrChanged(attrName: string): Boolean;
    /**
     * Retrieves the name of the changed attributes since the last save
     */
    changedAttrs(): Array<String>;
    /**
     * Retrieves the previous attributes
     */
    prevAttrs(): Object;
    /**
     * Retrieves the previous value prior to last save for a specific attribute
     */
    prevValue(attrName: string): any;
    /**
     * Fetches the newest attributes from the origin.
     */
    fetch(httpQuery?: WebServices.HttpQuery, camelize?: Boolean): Promise<WebServices.HttpResponse>;
    /**
     * Parses the resources data from an incoming HttpResponse
     * The idea is to return the resources attributes exclusively
     */
    $parse(data: Object, dataPrefixKey?: string): Object;
    /**
     * Transforms the local attributes to be processed by the origin in JSON format
     */
    toOriginJSON(): Object;
    /**
     * Transforms the local attributes to be processed by the origin in XML format
     */
    toOriginXML(): String;
    /**
     * Transforms the local attributes to be processed by the origin in a specific format
     */
    toOrigin(format: string): Object | String;
    /**
     * Saves the local object into the origin
     */
    save(httpHeaders?: WebServices.HttpHeader[]): Promise<WebServices.HttpResponse>;
    /**
     * Destroys the current record in the origin
     */
    destroy(): Promise<any>;
    /**
     * Retrieves a collection of records from the origin
     */
    static fetchIndex(httpQuery?: WebServices.HttpQuery): Promise<Array<any>>;
    /**
     * Retrieves a single record from the origin
     * @param id          The record id that we want to fetch by
     * @param httpQuery   Use a HttpQuery instance to override the default query
     */
    static fetchOne(id: Number, httpQuery?: WebServices.HttpQuery): Promise<any>;
}
export interface ISdkzerConfigOptions {
    defaultHttpHeaders: string;
}
export interface IHttpQueryGuessConfig {
    restful: Object;
}
