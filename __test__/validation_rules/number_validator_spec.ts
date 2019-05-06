import { NumberValidator } from "../../src/validation_rules/number_validator"

describe("NumberValidator", () => {
  const numberValidator = new NumberValidator({ min: 3, max: 8 });

  test(`it should be INVALID with a smaller number than the minimum required`, () => {
    expect(numberValidator.isValid(null, 2)).toEqual(false);
    expect(numberValidator['_invalidMessage']).toEqual(`2 is smaller than 3`);
  });

  test(`it should be INVALID with a higher number than the maximum required`, () => {
    expect(numberValidator.isValid(null, 9)).toEqual(false);
    expect(numberValidator['_invalidMessage']).toEqual(`9 is bigger than 8`);
  });
});
