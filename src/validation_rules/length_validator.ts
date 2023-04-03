import {ValidationRule} from '../validation_rule'

export interface IParams {
  min: number; // min number of items in the array
  max: number; // max number of items in the array
}

export class LengthValidator extends ValidationRule<IParams> {
  protected conditions:Array<Function> = [
    () => {
      let match:boolean = true;

      if (this.toValue.length < this.params.min) {
        match = false;
        this.addInvalidMessage(`${this.toValue} contains less than ${this.params.min} items`);
      }
      if (this.toValue.length > this.params.max) {
        match = false;
        this.addInvalidMessage(`${this.toValue} contains more than ${this.params.max} items`);
      }

      return match;
    }
  ]
}
