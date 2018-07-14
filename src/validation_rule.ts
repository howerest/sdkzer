/* --------------------------------------------------------------------------

    howerest 2018 - <hola@davidvalin.com> | www.howerest.com

    Apache 2.0 Licensed
    -------------------

    ValidationRule: represents a validation rule

--------------------------------------------------------------------------- */

export class ValidationRule implements IValidationRule {
  protected conditions: Array<Function|any> = [];
  public fromValue:any;
  public toValue:any
  public params:Object
  private _invalidMessage = "Invalid";

  constructor(params?:any) {
    this.params = params;
    this._invalidMessage = "";
  }

  /**
   * Retrieves the invalid message for the ValidationRule
   */
  get invalidMessage(): string {
    return this._invalidMessage;
  }

  /**
   * Checks if the ValidationRule is valid
   */
  public isValid(fromValue:any, toValue:any): Boolean {
    this.fromValue = fromValue;
    this.toValue = toValue;

    // Reset the invalid message
    this._invalidMessage = '';

    for(let i=0; i < this.conditions.length; i++) {
      if (this.conditions[i]() === false) {
        return false;
      }
    }
    return true;
  }

  /**
   * Adds an invalid message to the ValidationRule
   */
  public addInvalidMessage(message:String) {
    this._invalidMessage += message;
  }
}

export interface IValidationRule {
  params: any;
  invalidMessage: String;

  isValid(fromValue:any, toValue:any);
}
