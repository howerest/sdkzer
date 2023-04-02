import {ValidationRule} from '../validation_rule'

export class RequiredValidator extends ValidationRule {
  protected conditions:Array<Function> = [
    () => {
      let match:boolean = true;
      if (typeof(this.toValue) === "undefined" || this.toValue.length === 0) {
        match = false;
        this.addInvalidMessage("A value is required and was not provided");
      }
      return match;
    }
  ]
}