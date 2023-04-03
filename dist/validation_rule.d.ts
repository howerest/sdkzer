export declare class ValidationRule<IParams = {}> implements IValidationRule {
    protected conditions: Array<Function | any>;
    fromValue: any;
    toValue: any;
    params: IParams;
    private _invalidMessage;
    constructor(params?: any);
    /**
     * Retrieves the invalid message for the ValidationRule
     */
    get invalidMessage(): string;
    /**
     * Checks if the ValidationRule is valid
     */
    isValid(fromValue: any, toValue: any): boolean;
    /**
     * Adds an invalid message to the ValidationRule
     */
    addInvalidMessage(message: string): void;
}
export interface IValidationRule {
    params: any;
    invalidMessage: string;
    isValid(fromValue: any, toValue: any): any;
}
