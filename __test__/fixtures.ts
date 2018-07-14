/* --------------------------------------------------------------------------

    howerest 2018 - <hola@davidvalin.com> | www.howerest.com
      Apache 2.0 Licensed

    This sdk entity is being used for unit testing to test communication
    between local entity data and origin data-source

 --------------------------------------------------------------------------- */

import { Sdkzer } from "../src/howerest.sdkzer";
import { ValidationRule } from "../src/validation_rule";

export class Item extends Sdkzer {
  public baseEndpoint() {
    return 'http://api.mydomain.com/v1/items';
  }

  public defaults() {
    return {
      name: "A good choice",
      items: [1, 100, 1, 60]
    };
  }

  public parseOne(data) {
    // Parse record
    var json = {
      id: data.id,
      name: data.name,
      items: data.items
    };

    return json;
  }

  public parse(data) {
    var parsed = [];

    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        parsed.push(this.parseOne(data[i]));
      }
    } else {
      parsed.push(this.parseOne(data.folder));
    }

    return parsed;
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
