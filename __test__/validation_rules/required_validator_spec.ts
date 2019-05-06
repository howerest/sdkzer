import { RequiredValidator } from "../../src/validation_rules/required_validator"

describe("RequiredValidator", () => {
  const requiredValidator = new RequiredValidator();

  test(`it should be INVALID when the value is undefined`, () => {
    expect(requiredValidator.isValid(null, undefined)).toEqual(false);
    expect(requiredValidator['_invalidMessage']).toEqual(`A value is required and was not provided`);
  });

  test(`it should be VALID when a value is defined`, () => {
    expect(requiredValidator.isValid(null, "anything")).toEqual(true);
    expect(requiredValidator['_invalidMessage']).toEqual('');
  });
});
