/* --------------------------------------------------------------------------

    howerest 2016 - <davidvalin@howerest.com> | www.howerest.com
      Apache 2.0 Licensed

    This sdk entity is being used for unit testing to test communication
    between local entity data and origin data-source

 --------------------------------------------------------------------------- */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var howerest_sdkzer_1 = require("../howerest.sdkzer");
var validation_rule_1 = require("../validation_rule");
var Item = (function (_super) {
    __extends(Item, _super);
    function Item() {
        return _super.apply(this, arguments) || this;
    }
    Item.prototype.baseEndpoint = function () {
        return 'http://api.mydomain.com/v1/items';
    };
    Item.prototype.defaults = function () {
        return {
            name: "A good choice",
            items: [1, 100, 1, 60]
        };
    };
    Item.prototype.parseOne = function (data) {
        // Parse record
        var json = {
            id: data.id,
            name: data.name,
            items: data.items
        };
        return json;
    };
    Item.prototype.parse = function (data) {
        var parsed = [];
        if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                parsed.push(this.parseOne(data[i]));
            }
        }
        else {
            parsed.push(this.parseOne(data.folder));
        }
        return parsed;
    };
    return Item;
}(howerest_sdkzer_1.Sdkzer));
exports.Item = Item;
function buildSdkzerModelEntity() {
    return Item;
}
exports.buildSdkzerModelEntity = buildSdkzerModelEntity;
// ----------------------------------------------------------------------------
// Validation Rule fixtures
var SampleValidationRuleFixture = (function (_super) {
    __extends(SampleValidationRuleFixture, _super);
    function SampleValidationRuleFixture() {
        var _this = _super.apply(this, arguments) || this;
        _this.conditions = [
            function () {
                return true;
            },
            function () {
                return true;
            }
        ];
        return _this;
    }
    return SampleValidationRuleFixture;
}(validation_rule_1.ValidationRule));
exports.SampleValidationRuleFixture = SampleValidationRuleFixture;
var SampleValidationRuleFixture2 = (function (_super) {
    __extends(SampleValidationRuleFixture2, _super);
    function SampleValidationRuleFixture2() {
        var _this = _super.apply(this, arguments) || this;
        _this.conditions = [
            function () {
                return true;
            },
            function () {
                _this.addInvalidMessage("Invalid message");
                return false;
            }
        ];
        return _this;
    }
    return SampleValidationRuleFixture2;
}(validation_rule_1.ValidationRule));
exports.SampleValidationRuleFixture2 = SampleValidationRuleFixture2;
var SampleGlobalValidationRuleFixture = (function (_super) {
    __extends(SampleGlobalValidationRuleFixture, _super);
    function SampleGlobalValidationRuleFixture() {
        var _this = _super.apply(this, arguments) || this;
        _this.conditions = [
            function () { return true; },
            function () {
                _this.addInvalidMessage('Invalid field');
                return false;
            }
        ];
        return _this;
    }
    return SampleGlobalValidationRuleFixture;
}(validation_rule_1.ValidationRule));
exports.SampleGlobalValidationRuleFixture = SampleGlobalValidationRuleFixture;
