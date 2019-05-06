import {ValidationRule} from '../validation_rule'

interface NumberValidatorParams { min: number, max: number }

export class NumberValidator extends ValidationRule {
  protected conditions:Array<Function> = [
    () => {
      let match:Boolean = true;

      if (this.toValue < this.params['min']) {
        match = false;
        this.addInvalidMessage(this.toValue + " is smaller than " + this.params['min']);
      }
      if (this.toValue > this.params['max']) {
        match = false;
        this.addInvalidMessage(this.toValue + " is bigger than " + this.params['max']);
      }

      return match;
    }
  ]
}
