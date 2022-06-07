"use strict";
exports.__esModule = true;
var expert_system_1 = require("./expert-system");
function generalESRun(inputData) {
    var data = {
        UNSAFE_MANUFACTURER: inputData[0],
        EMAIL_MATCH_WEBSITE: inputData[1],
        TOO_MANY_HIGH_RISK_APPS: inputData[2],
        TOO_MANY_MED_RISK_APPS: inputData[3],
        APP_COUNT: inputData[4],
        ANDROID_OS_VERSION: inputData[5],
        APP_AVG_SCORE: inputData[6]
    };
    var generalES = new expert_system_1.ExpertSystem();
    addKnowledgeapp(data, generalES);
    addRules(generalES);
    generalES.Start();
    return (Math.round(((generalES.knowledge.get('DEVICE_SCORE')) + Number.EPSILON) * 100) / 100.0);
}
exports.generalESRun = generalESRun;
function addKnowledgeapp(inputData, es) {
    for (var _i = 0, _a = Object.entries(inputData); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        es.addKnowledge(key, value);
    }
}
function addRules(es) {
    es.addRule('lots of apps', function () {
        if (knowledge.get('APP_COUNT') > 40 && knowledge.get('APP_COUNT') <= 60) {
            addKnowledge('LOTS_OF_APPS', true);
            log('device', 'More Apps than the average User: ' + knowledge.get('APP_COUNT'));
        }
    });
    es.addRule('too many apps', function () {
        if (knowledge.get('APP_COUNT') > 60 && knowledge.get('APP_COUNT') <= 100) {
            addKnowledge('TOO_MANY_APPS', true);
            log('device', 'Large number of apps on device: ' + knowledge.get('APP_COUNT'));
        }
    });
    es.addRule('too many apps', function () {
        if (knowledge.get('APP_COUNT') > 100) {
            addKnowledge('WAY_TOO_MANY_APPS', true);
            log('device', 'Extremly large number of apps on device: ' + knowledge.get('APP_COUNT'));
        }
    });
    es.addRule('too many high risk apps', function () {
        if (knowledge.get('HIGH_RISK_COUNT') > 7) {
            addKnowledge('TOO_MANY_HIGH_RISK_APPS', true);
            log('device', 'Too many high risk apps');
        }
    });
    es.addRule('too many med risk apps', function () {
        if (knowledge.get('MED_RISK_COUNT') > 30) {
            addKnowledge('TOO_MANY_MED_RISK_APPS', true);
            log('device', 'too many medium risk apps');
        }
    });
    es.addRule('chineese manufacturers', function () {
        var _a;
        if (['Huawei', 'Xiaomi'].includes((_a = knowledge.get('BRAND'), (_a !== null && _a !== void 0 ? _a : '')))) {
            addKnowledge('UNSAFE_MANUFACTURER', true);
            log('device', 'unsafe manufacurer: ' + knowledge.get('BRAND'));
        }
    });
    es.addRule('version under 12', function () {
        if (knowledge.get('ANDROID_OS_VERSION')) {
            addKnowledge('VERSION_RISK', Math.max(0, 13 - knowledge.get('ANDROID_OS_VERSION')) / 4);
        }
    });
    es.addRule('compute app score subtraction', function () {
        if (knowledge.get('APP_AVG_SCORE')) {
            var app_risk = (10 - Math.floor(knowledge.get('APP_AVG_SCORE'))) / 4;
            addKnowledge('APP_RISK', app_risk);
        }
    });
    es.addRule('compute device security', function () {
        var _a;
        var dev_sec = 10.0;
        dev_sec -= knowledge.get('VERSION_RISK') ? 1.0 : 0;
        dev_sec -= knowledge.get('UNSAFE_MANUFACTURER') ? 1.0 : 0;
        dev_sec -= (knowledge.get('TOO_MANY_MED_RISK_APPS') ? 0.5 : 0);
        dev_sec -= (knowledge.get('TOO_MANY_HIGH_RISK_APPS') ? 0.5 : 0);
        dev_sec -= knowledge.get('WAY_TOO_MANY_APPS') ? 1.0 : 0;
        dev_sec -= knowledge.get('TOO_MANY_APPS') ? 0.5 : 0;
        dev_sec -= knowledge.get('LOTS_OF_APPS') ? 0.3 : 0;
        dev_sec -= (10 - Math.floor((_a = knowledge.get('APP_AVG_SCORE'), (_a !== null && _a !== void 0 ? _a : 5)))) / 4;
        addKnowledge('DEVICE_SCORE', dev_sec);
    });
}
