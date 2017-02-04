import { Sdkzer } from "../howerest.sdkzer";
import { ValidationRule } from "../validation_rule";
export declare class Item extends Sdkzer {
    baseEndpoint(): string;
    defaults(): {
        name: string;
        items: number[];
    };
    parseOne(data: any): {
        id: any;
        name: any;
        items: any;
    };
    parse(data: any): any[];
}
export declare function buildSdkzerModelEntity(): typeof Item;
export declare class SampleValidationRuleFixture extends ValidationRule {
    protected conditions: Array<Function>;
}
export declare class SampleValidationRuleFixture2 extends ValidationRule {
    protected conditions: Array<Function>;
}
export declare class SampleGlobalValidationRuleFixture extends ValidationRule {
    protected conditions: Array<Function>;
}
