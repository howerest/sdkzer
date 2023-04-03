import {ValidationRule} from '../validation_rule'

export interface IParams {
  min: number; // min number value allowed
  max: number; // max number value allowed
}

export class NumberValidator extends ValidationRule<IParams> {
  protected conditions:Array<Function> = [
    () => {
      let match:boolean = true;

      if (this.toValue < this.params.min) {
        match = false;
        this.addInvalidMessage(`${this.toValue} is smaller than ${this.params.min}`);
      }
      if (this.toValue > this.params.max) {
        match = false;
        this.addInvalidMessage(`${this.toValue} is bigger than ${this.params.max}`);
      }

      return match;
    }
  ]
}
