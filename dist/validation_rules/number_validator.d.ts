import { ValidationRule } from '../validation_rule';
export interface IParams {
    min: number;
    max: number;
}
export declare class NumberValidator extends ValidationRule<IParams> {
    protected conditions: Array<Function>;
}
