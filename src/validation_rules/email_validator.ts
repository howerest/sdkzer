import {ValidationRule} from '../validation_rule'
import {RegExpValidator} from './reg_exp_validator'

export class EmailValidator extends ValidationRule {
  protected conditions:Array<Function> = [
    // Check for email regexp...
    () => {
      let match:boolean = true;
      const regExpValidator = new RegExpValidator({ rule: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i });
      if (!regExpValidator.isValid(this.fromValue, this.toValue)) {
        this.addInvalidMessage(this.toValue + ' is not a valid email address');
        match = false;
      }
      return match;
    }
  ]
}