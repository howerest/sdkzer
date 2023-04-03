import {ValidationRule} from '../validation_rule'

export interface IParams {
  allowed: Array<{
    from: string;
    to: any[];
  }>
}

export class AllowedValueSwitchValidator extends ValidationRule<IParams> {
  // Sample declaration of allowed transition:

  // {
  //   allowed: [
  //     { from: "open", to: ["scheduled", "canceled", "closed"] },
  //     { from: "close", to: ["open"] }
  //   ]
  // }

  protected conditions:Array<Function> = [
    () => {
      let match:boolean = false,
          rule;

      if (this.params && this.params.allowed && this.params.allowed.length) {
        for (let i = 0; i < this.params.allowed.length; i++) {
          rule = this.params.allowed[i];
          if (rule.from && rule.to && rule.to.length) {
            // Origin value matched
            if (rule.from === this.fromValue) {
              // Check that the destination value also allowed
              for (let i2 = 0; i2 < rule.to.length; i2++) {
                if (!match) {
                  if (this.toValue === rule.to[i2]) {
                    match = true;
                  }
                }
              }
            }
          }
        }
      }
      if (!match) {
        this.addInvalidMessage(`${this.fromValue} cannot change to '${this.toValue}'`);
      }

      return match;
    }
  ]
}
