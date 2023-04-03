import { ValidationRule } from '../validation_rule';
export interface IParams {
    allowed: Array<{
        from: string;
        to: any[];
    }>;
}
export declare class AllowedValueSwitchValidator extends ValidationRule<IParams> {
    protected conditions: Array<Function>;
}
