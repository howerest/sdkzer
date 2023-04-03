import {ValidationRule} from '../validation_rule'

export interface IParams {
  rule: RegExp
}

export class RegExpValidator extends ValidationRule<IParams> {
  protected conditions:Array<Function> = [
    () => {
      let match:boolean = true;
      if (!this.toValue || !this.toValue.match || !this.toValue.match(this.params.rule)) {
        match = false;
        this.addInvalidMessage(`${this.toValue} is not valid`);
      }
      return match;
    }
  ]
}
