/* --------------------------------------------------------------------------

    howerest 2016 - <davidvalin@howerest.com> | www.howerest.com

    Apache 2.0 Licensed
    -------------------

    ValidationRule: represents a validation rule

--------------------------------------------------------------------------- */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationRule = (function () {
    function ValidationRule(params) {
        this.conditions = [];
        this._invalidMessage = "Invalid";
        this.params = params;
        this._invalidMessage = "";
    }
    Object.defineProperty(ValidationRule.prototype, "invalidMessage", {
        /**
         * Retrieves the invalid message for the ValidationRule
         */
        get: function () {
            return this._invalidMessage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if the ValidationRule is valid
     */
    ValidationRule.prototype.isValid = function (fromValue, toValue) {
        this.fromValue = fromValue;
        this.toValue = toValue;
        // Reset the invalid message
        this._invalidMessage = '';
        for (var i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i]() === false) {
                return false;
            }
        }
        return true;
    };
    /**
     * Adds an invalid message to the ValidationRule
     */
    ValidationRule.prototype.addInvalidMessage = function (message) {
        this._invalidMessage += message;
    };
    return ValidationRule;
}());
exports.ValidationRule = ValidationRule;
