export declare class ValidationRule implements IValidationRule {
    protected conditions: Array<Function | any>;
    fromValue: any;
    toValue: any;
    params: Object;
    private _invalidMessage;
    constructor(params?: any);
    /**
     * Retrieves the invalid message for the ValidationRule
     */
    readonly invalidMessage: string;
    /**
     * Checks if the ValidationRule is valid
     */
    isValid(fromValue: any, toValue: any): Boolean;
    /**
     * Adds an invalid message to the ValidationRule
     */
    addInvalidMessage(message: String): void;
}
export interface IValidationRule {
    params: any;
    invalidMessage: String;
    isValid(fromValue: any, toValue: any): any;
}
