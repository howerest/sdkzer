import { LengthValidator } from "../../src/validation_rules/length_validator"

describe("LengthValidator", () => {
  const lengthValidator = new LengthValidator({ min: 3, max: 6 });

  test(`it should be INVALID with a smaller array items than the minimum required`, () => {
    expect(lengthValidator.isValid(null, ["a", "b"])).toEqual(false);
    expect(lengthValidator['_invalidMessage']).toEqual(`a,b contains less than 3 items`);
  });

  test(`it should be INVALID with a higher array items than the maximum required`, () => {
    expect(lengthValidator.isValid(null, ["a", "b", "c", "d", "e", "f", "g"])).toEqual(false);
    expect(lengthValidator['_invalidMessage']).toEqual(`a,b,c,d,e,f,g contains more than 6 items`);
  });

  test(`it should be VALID with the right amount of items required`, () => {
    expect(lengthValidator.isValid(null, ["a", "b", "c"])).toEqual(true);
    expect(lengthValidator['_invalidMessage']).toEqual('');
  });
});
