import {ValidationRule} from '../validation_rule'

interface LengthValidatorParams { min: number, max: number }

export class LengthValidator extends ValidationRule {
  protected conditions:Array<Function> = [
    () => {
      let match:Boolean = true;

      if (this.toValue.length < this.params['min']) {
        match = false;
        this.addInvalidMessage(`${this.toValue} contains less than ${this.params['min']} items`);
      }
      if (this.toValue.length > this.params['max']) {
        match = false;
        this.addInvalidMessage(`${this.toValue} contains more than ${this.params['max']} items`);
      }

      return match;
    }
  ]
}
