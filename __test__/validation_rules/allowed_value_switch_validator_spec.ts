import { AllowedValueSwitchValidator } from "../../src/validation_rules/allowed_value_switch_validator"

describe("AllowedValueSwitchValidator", () => {
  const allowedValueSwitchValidator = new AllowedValueSwitchValidator({
    allowed: [
      { from: "open", to: ["scheduled", "canceled", "closed"] },
      { from: "close", to: ["open"] }
    ]
  });

  test(`it should be INVALID when transitioning to invalid values`, () => {
    expect(allowedValueSwitchValidator.isValid("open", "so open")).toEqual(false);
    expect(allowedValueSwitchValidator['_invalidMessage']).toEqual("open cannot change to 'so open'");
  });

  test(`it should be VALID when transitioning to an allowed value`, () => {
    expect(allowedValueSwitchValidator.isValid("open", "scheduled")).toEqual(true);
    expect(allowedValueSwitchValidator['_invalidMessage']).toEqual('');
  });
});
