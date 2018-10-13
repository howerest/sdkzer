import {ValidationRule} from '../validation_rule'

export class AllowedValueSwitchValidator extends ValidationRule {
    // Sample declaration of allowed transition:

    // {
    //   matches: [
    //     { from: "open", to: ["scheduled", "canceled", "closed"] },
    //     { from: "close", to: ["open"] }
    //   ]
    // }

  protected conditions:Array<Function> = [
    () => {
      let match:Boolean = false;

      if (this.params && this.params['matches'] && this.params['matches'].length) {
        for (let i = 0; i < this.params['matches'].length; i++) {
          const rule = this.params['matches'][i];
          if (rule['from'] && rule['to'] && rule['to'].length) {
            // Origin value matched
            if (rule['from'] === this.fromValue) {
              // Check that the destination value also matches
              for (let i2 = 0; i2 < rule['to'].length; i2++) {
                if (!match) {
                  if (this.toValue === rule['to'][i2] && !match) {
                    match = true;
                  }
                }
              }
            } else {
              match = false;
            }
          }
        }
      }
      if (!match) {
        this.addInvalidMessage(this.fromValue + " cannot change to '" + this.toValue + "'");
      }

      return match;
    }
  ]
}