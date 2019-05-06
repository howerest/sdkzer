import { RegExpValidator } from "../../src/validation_rules/reg_exp_validator"

describe("RegExpValidator", () => {
  const regExpValidator = new RegExpValidator({ rule: /holahola/ });

  // NOTE: maybe test for .match() called?

  test(`it should be INVALID when not matching the regexp`, () => {
    expect(regExpValidator.isValid(null, "holaquetal")).toEqual(false);
    expect(regExpValidator['_invalidMessage']).toEqual(`holaquetal is not valid`);
  });

  test(`it should be VALID when matching the regexp`, () => {
    expect(regExpValidator.isValid(null, "siholaholaquetal")).toEqual(true);
    expect(regExpValidator['_invalidMessage']).toEqual('');
  });
});
