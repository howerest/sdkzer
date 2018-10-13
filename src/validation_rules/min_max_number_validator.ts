import {ValidationRule} from '../validation_rule'

interface MinMaxNumberValidatorParams { min: number, max: number }

export class MinMaxNumberValidator extends ValidationRule {
  protected conditions:Array<Function> = [
    () => {
      let match:Boolean = true;

      if (this.toValue.length < this.params['min']) {
        match = false;
        this.addInvalidMessage(this.toValue + " is shorter than " + this.params['min']);
      }
      if (this.toValue.length > this.params['max']) {
        match = false;
        this.addInvalidMessage(this.toValue + " is longer than " + this.params['max']);
      }

      return match;
    }
  ]
}