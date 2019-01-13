/* --------------------------------------------------------------------------

    howerest 2018 - <hola@davidvalin.com> | www.howerest.com
      Apache 2.0 Licensed

    This sdk entity is being used for unit testing to test communication
    between local entity data and origin data-source

 --------------------------------------------------------------------------- */

import { Sdkzer, SdkzerParams } from "../src/howerest.sdkzer";
import { ValidationRule } from "../src/validation_rule";

export interface EntityFields extends SdkzerParams {
  name?: string;
  age?: number;
}


export class Item extends Sdkzer<EntityFields> {
  public baseEndpoint() {
    return 'http://api.mydomain.com/v1/items';
  }


  public defaults() {
    return {
      name: "A good choice",
      items: [1, 100, 1, 60]
    };
  }
}

export function buildSdkzerModelEntity() {
  return Item;
}


// ----------------------------------------------------------------------------
// Validation Rule fixtures

export class SampleValidationRuleFixture extends ValidationRule {
  protected conditions:Array<Function> = [
    () => {
      return true;
    },
    () => {
      return true;
    }
  ]
}

export class SampleValidationRuleFixture2 extends ValidationRule {
  protected conditions:Array<Function> = [
    () => {
      return true;
    },
    () => {
      this.addInvalidMessage("Invalid message");
      return false;
    }
  ]
}

export class SampleGlobalValidationRuleFixture extends ValidationRule {
  protected conditions:Array<Function> = [
    () => { return true; },
    () => { this.addInvalidMessage('Invalid field');
    return false;}
  ]
}
