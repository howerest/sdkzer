import { ValidationRule } from '../validation_rule';
export interface IParams {
    rule: RegExp;
}
export declare class RegExpValidator extends ValidationRule<IParams> {
    protected conditions: Array<Function>;
}
