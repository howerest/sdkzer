export interface SdkzerParams {
    id: any;
}
export declare class Sdkzer<T extends SdkzerParams> {
    attrs: T;
    pAttrs: T;
    protected validationRules: object;
    invalidMessages: object;
    syncing: boolean;
    lastResponse: Response | null;
    private static DEFAULT_HTTP_HEADERS;
    private static PARENTS_FETCH_STRATEGY;
    /**
     * Creates an instance of a model entity with an API to communicate with
     * a resource (http RESTful resource)
     * @param  {object}   attrs   The initial attributes for the resource.
     *                            Those attributes are in force to defaults()
     */
    constructor(attrs?: T);
    /**
     * Configures Sdkzer constants that determine the behaviour of Sdkzer in all
     * classes that extend from Sdkzer in the current scope.
     * @param {ISdkzerConfigOptions} options The configuration options
     */
    static configure(options: ISdkzerConfigOptions): void;
    /**
     * Sets the defaults() values in the instance attributes
     */
    setDefaults(): void;
    /**
     * Retrieves the defaults for the entity. Override it using your default
     * attributes if you need any
     */
    defaults(): object;
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
    attr(attrName?: string, value?: any): string | number | boolean | object;
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
    resourceEndpoint(): string;
    /**
     * Checks if the record is not saved in the origin. An record will be
     * consiered new when it has an "id" attribute set to null and it lacks of
     * a "lastResponse" attribute value
     */
    isNew(): boolean;
    /**
     * Checks if the record has changed since the last save
     */
    hasChanged(): boolean;
    /**
     * Checks if an attribute has changed from the origin
     */
    hasAttrChanged(attrName: string): boolean;
    /**
     * Retrieves the name of the changed attributes since the last save
     */
    changedAttrs(): Array<string>;
    /**
     * Retrieves the previous attributes
     */
    prevAttrs(): T;
    /**
     * Retrieves the previous value prior to last save for a specific attribute
     */
    prevValue(attrName: string): any;
    /**
     * Fetches the newest attributes from the origin.
     */
    fetch(httpQuery?: IQuery, camelize?: boolean): Promise<Response>;
    /**
     * Parses a single resource record from an incoming HttpResponse data
     * NOTE: The idea is to return the parsed record data only
     */
    parseRecord(data: object, prefix?: string): T;
    /**
     * Parses a collection of resource records from an incoming HttpResponse data
     * NOTE: The idea is to return the parsed collection of records data only
     */
    static parseCollection(data: Array<object>, prefix?: string): Array<object>;
    /**
     * Transforms the local attributes to be processed by the origin in JSON format
     */
    toOriginJSON(): object;
    /**
     * Transforms the local attributes to be processed by the origin in XML format
     */
    toOriginXML(): string;
    /**
     * Transforms the local attributes to be processed by the origin in a specific format
     * @param format The format to transform into
     */
    toOrigin(format?: string): object | string;
    /**
     * Persists the local state into the origin
     */
    save(httpHeaders?: THttpHeaders): Promise<Response>;
    /**
     * Destroys the current record in the origin
     */
    destroy(): Promise<Response>;
    /**
     * Retrieves a collection of records from the origin
     * @param httpQuery An optional query to be merged with the default one
     */
    static fetchIndex(httpQuery?: IQuery): Promise<Array<any>>;
    /**
     * Retrieves a single record from the origin
     * @param id          The record id that we want to fetch by
     * @param httpQuery   Use a HttpQuery instance to override the default query
     */
    static fetchOne(id: number | string, httpQuery?: IQuery): Promise<any>;
}
export type THttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type THttpHeaders = {
    [key: string]: string;
};
export interface IQueryString {
    [key: string]: string | number;
}
export interface IQuery {
    url?: string;
    method?: THttpMethod;
    headers?: THttpHeaders;
    qsParams?: IQueryString;
    data?: {};
}
export interface ISdkzerConfigOptions {
    defaultHttpHeaders: THttpHeaders;
}
export { ValidationRule } from "./validation_rule";
export { RequiredValidator } from "./validation_rules/required_validator";
export { RegExpValidator, IParams as IRegExpValidatorParams } from "./validation_rules/reg_exp_validator";
export { NumberValidator, IParams as INumberValidatorParams } from "./validation_rules/number_validator";
export { LengthValidator, IParams as ILengthValidatorParams } from "./validation_rules/length_validator";
export { EmailValidator } from "./validation_rules/email_validator";
export { AllowedValueSwitchValidator, IParams as IAllowedValueSwitchValidatorParams } from "./validation_rules/allowed_value_switch_validator";
