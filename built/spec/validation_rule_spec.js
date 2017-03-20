/* --------------------------------------------------------------------------

    howerest 2016 - <davidvalin@howerest.com> | www.howerest.com
      Apache 2.0 Licensed

--------------------------------------------------------------------------- */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validation_rule_1 = require("../validation_rule");
var fixtures_1 = require("./fixtures");
describe("ValidationRule", function () {
    var validationRule;
    beforeEach(function () {
        validationRule = new validation_rule_1.ValidationRule({ firstParamName: 'whatever value', secondParamName: { a: 1001, b: /.*howerest/ } });
    });
    describe('.constructor()', function () {
        it("should assign the value and validator params within the instance", function () {
            expect(validationRule['params']).toBeDefined();
            expect(validationRule['params']).toEqual({ firstParamName: 'whatever value', secondParamName: { a: 1001, b: /.*howerest/ } });
        });
        it("should initialize the _invalidMessage as empty", function () {
            expect(validationRule._invalidMessage).toEqual("");
        });
    });
    describe('.isValid()', function () {
        it("should assign the original and final values within the instance", function () {
            validationRule.isValid("original value", "new value");
            expect(validationRule['fromValue']).toBeDefined();
            expect(validationRule['fromValue']).toEqual("original value");
            expect(validationRule['toValue']).toBeDefined();
            expect(validationRule['toValue']).toEqual("new value");
        });
        it("should return true when all the ValidationRule conditions return true", function () {
            var sampleValidationRuleFixture = new fixtures_1.SampleValidationRuleFixture();
            expect(sampleValidationRuleFixture.isValid(null, true)).toBeTruthy();
        });
        it("should return false when at least one of the ValidationRule conditions return false", function () {
            var sampleValidationRuleFixture2 = new fixtures_1.SampleValidationRuleFixture2();
            expect(sampleValidationRuleFixture2.isValid(null, true)).toBeFalsy();
        });
    });
    describe('.addInvalidMessage()', function () {
        it("should add a message to the invalid messages", function () {
            expect(validationRule._invalidMessage).toEqual("");
            validationRule.addInvalidMessage("A new invalid message describing the error");
            expect(validationRule._invalidMessage).toEqual("A new invalid message describing the error");
        });
    });
});
