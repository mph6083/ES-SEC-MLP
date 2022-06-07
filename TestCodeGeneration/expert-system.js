"use strict";
exports.__esModule = true;
var ExpertSystem = /** @class */ (function () {
    function ExpertSystem() {
        this.outputs = new Map();
        this.knowledge = new Map();
        this.logs = new Map();
        this.outputDefaults = new Map();
        this.rules = new Array();
    }
    ;
    ExpertSystem.prototype.addRule = function (rulename, rule) {
        var ruleString = rule.toString();
        if (!(ruleString.startsWith('()') || ruleString.startsWith('function'))) {
            throw new Error('Invalid Rule Formatting');
        }
        var ruleTrimmedString = ruleString.split('{');
        ruleTrimmedString.shift();
        ruleTrimmedString = ruleTrimmedString.join('{').split('}');
        ruleTrimmedString.pop();
        ruleTrimmedString = ruleTrimmedString.join('}');
        var newRule = (new Function('with (this) { ' + ruleTrimmedString + '}')).bind(this);
        this.rules.push(newRule);
    };
    ExpertSystem.prototype.setOutputDefualts = function (outputDefaultsParam) {
        this.outputDefaults = outputDefaultsParam;
    };
    ExpertSystem.prototype.addKnowledge = function (tag, data) {
        this.knowledge.set(tag, data);
    };
    ExpertSystem.prototype.addKnowledgeMap = function (info) {
        var _this = this;
        info.forEach(function (value, key) {
            _this.knowledge.set(key, value);
        });
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ExpertSystem.prototype.Start = function () {
        var startingKnowledge;
        var endingKnowledge;
        // eslint-disable-next-line eqeqeq
        do {
            startingKnowledge = JSON.stringify(Array.from(this.knowledge.entries()));
            this.outputs = new Map(this.outputDefaults);
            for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
                var rule = _a[_i];
                try {
                    rule();
                }
                catch (_b) { }
                ;
            }
            endingKnowledge = JSON.stringify(Array.from(this.knowledge.entries()));
        } while (startingKnowledge !== endingKnowledge);
        return;
    };
    ExpertSystem.prototype.log = function (category, message) {
        if (!this.logs.has(category)) {
            this.logs.set(category, new Set());
        }
        this.logs.get(category).add(message);
    };
    return ExpertSystem;
}());
exports.ExpertSystem = ExpertSystem;
