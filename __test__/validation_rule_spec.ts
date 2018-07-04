/* --------------------------------------------------------------------------

    howerest 2018 - <hola@davidvalin.com> | www.howerest.com
      Apache 2.0 Licensed

--------------------------------------------------------------------------- */

import { ValidationRule } from "../src/validation_rule";
import { SampleValidationRuleFixture, SampleValidationRuleFixture2, SampleGlobalValidationRuleFixture } from "./fixtures";

describe("ValidationRule", () => {
  let validationRule;

  beforeEach(() => {
    validationRule = new ValidationRule({ firstParamName: 'whatever value', secondParamName: { a: 1001, b: /.*howerest/ }});
  });

  describe('.constructor()', () => {
    it("should assign the value and validator params within the instance", () => {
      expect(validationRule['params']).toBeDefined();
      expect(validationRule['params']).toEqual({ firstParamName: 'whatever value', secondParamName: { a: 1001, b: /.*howerest/ }})
    });

    it("should initialize the _invalidMessage as empty", () => {
      expect(validationRule._invalidMessage).toEqual("");
    });
  });

  describe('.isValid()', () => {
    it("should assign the original and final values within the instance", () => {
      validationRule.isValid("original value", "new value");
      expect(validationRule['fromValue']).toBeDefined();
      expect(validationRule['fromValue']).toEqual("original value");
      expect(validationRule['toValue']).toBeDefined();
      expect(validationRule['toValue']).toEqual("new value");
    });

    it("should return true when all the ValidationRule conditions return true", () => {
      const sampleValidationRuleFixture = new SampleValidationRuleFixture();
      expect(sampleValidationRuleFixture.isValid(null, true)).toBeTruthy();
    });

    it("should return false when at least one of the ValidationRule conditions return false", () => {
      const sampleValidationRuleFixture2 = new SampleValidationRuleFixture2();
      expect(sampleValidationRuleFixture2.isValid(null, true)).toBeFalsy();
    });
  });

  describe('.addInvalidMessage()', () => {
    it("should add a message to the invalid messages", () => {
      expect(validationRule._invalidMessage).toEqual("");
      validationRule.addInvalidMessage("A new invalid message describing the error");
      expect(validationRule._invalidMessage).toEqual("A new invalid message describing the error");
    });
  });
});
