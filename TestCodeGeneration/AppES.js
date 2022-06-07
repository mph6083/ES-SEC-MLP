"use strict";
exports.__esModule = true;
var expert_system_1 = require("./expert-system");
function getAns(inputData) {
    var data = {
        IS_AVALABLE: inputData[0],
        PRIVACY_MATCH_WEBSITE: inputData[1],
        EMAIL_MATCH_WEBSITE: inputData[2],
        EMAIL_IS_COMMON: inputData[3],
        PERMISSON_COUNT: inputData[4],
        INTERNET: inputData[5],
        HAS_BEEN_UPDATED: inputData[6],
        RECIENTLY_UPDATED: inputData[7],
        UPDATED_PAST_YEAR: inputData[8],
        ACCESS_FINE_LOCATION: inputData[9],
        ACCESS_NETWORK_STATE: inputData[10],
        READ_CONTACTS: inputData[11],
        RATING_SCORE: inputData[12],
        INSTALLS: inputData[13],
        RATING_COUNT: inputData[14]
    };
    var appES = new expert_system_1.ExpertSystem();
    addKnowledgeapp(data, appES);
    addRules(appES);
    appES.Start();
    return appES.knowledge.get('APP_SCORE');
}
exports.getAns = getAns;
function addKnowledgeapp(inputData, es) {
    for (var _i = 0, _a = Object.entries(inputData); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        es.addKnowledge(key, value);
    }
}
function addRules(es) {
    // if app has been updated update frequency score = 10
    es.addRule('see if app has been updated', function () {
        var _a;
        if (((_a = knowledge.get('RELEASE_DATE')) === null || _a === void 0 ? void 0 : _a.length) > 0 && knowledge.get('RELEASE_DATE') !== knowledge.get('LAST_UPDATED')) {
            addKnowledge('HAS_BEEN_UPDATED', true);
        }
        else {
            log('activity', 'app has never been updated');
        }
    });
    es.addRule('updated in the past month', function () {
        var date = new Date();
        var updatedDate = date.toLocaleString('en-us', { month: 'short' }) + date.getFullYear();
        var monthYear = knowledge.get('LAST_UPDATED').split(' ');
        monthYear = monthYear[0] + monthYear[2];
        if (knowledge.get('HAS_BEEN_UPDATED') && updatedDate === monthYear) {
            addKnowledge('RECIENTLY_UPDATED', true);
        }
    });
    es.addRule('updated in the past year', function () {
        var date = new Date();
        var updatedDate = '' + date.getFullYear();
        var monthYear = knowledge.get('LAST_UPDATED').split(' ');
        monthYear = monthYear[2];
        if (knowledge.get('HAS_BEEN_UPDATED') && updatedDate === monthYear) {
            addKnowledge('UPDATED_PAST_YEAR', true);
        }
    });
    es.addRule('ever been updated', function () {
        if (!knowledge.get('HAS_BEEN_UPDATED')) {
            addKnowledge('NO_UPDATES', true);
        }
    });
    es.addRule('not avalible and never been updated', function () {
        if (knowledge.get('IS_AVALABLE') === false && !knowledge.get('HAS_BEEN_UPDATED')) {
            addKnowledge('ACTIVE_SCORE', 0);
            log('active', 'app not avalible and never been updated');
        }
    });
    es.addRule('avalible and never been updated', function () {
        if (knowledge.get('IS_AVALABLE') && !knowledge.get('HAS_BEEN_UPDATED')) {
            addKnowledge('ACTIVE_SCORE', 2);
            log('active', 'app has not been updated');
        }
    });
    es.addRule('app is avalible and updated in the past month', function () {
        if (knowledge.get('IS_AVALABLE') && knowledge.get('RECIENTLY_UPDATED')) {
            addKnowledge('ACTIVE_SCORE', 10);
        }
    });
    es.addRule('avalible and updated this year but not within a month', function () {
        if (knowledge.get('IS_AVALABLE') && !knowledge.get('RECIENTLY_UPDATED') && knowledge.get('UPDATED_PAST_YEAR') && knowledge.get('HAS_BEEN_UPDATED')) {
            addKnowledge('ACTIVE_SCORE', 6);
        }
    });
    es.addRule('avalible and updated but not in the past year', function () {
        if (!knowledge.get('RECIENTLY_UPDATED') && knowledge.get('HAS_BEEN_UPDATED') && !knowledge.get('UPDATED_PAST_YEAR')) {
            addKnowledge('ACTIVE_SCORE', 4);
            log('active', 'app not updated in the past year');
        }
    });
    es.addRule('', function () {
        if (knowledge.get('EMAIL_MATCH_WEBSITE') === true && !(knowledge.get('EMAIL_IS_COMMON') === true) && knowledge.get('PRIVACY_MATCH_WEBSITE') === true) {
            addKnowledge('DEVELOPER_TRUST', 10);
        }
    });
    es.addRule('common email and privacy matches dev email', function () {
        if (knowledge.get('EMAIL_IS_COMMON') && knowledge.get('PRIVACY_MATCH_WEBSITE')) {
            addKnowledge('DEVELOPER_TRUST', 7);
        }
    });
    es.addRule('Rating number degree of trust', function () {
        addKnowledge('RATING_COUNT_MODIFIER', 0);
        if (knowledge.get('RATING_COUNT') < 50) {
            addKnowledge('RATING_COUNT_MODIFIER', 0);
            log('rating', 'app does not have lots of ratings');
        }
    });
    es.addRule('Rating number degree of trust', function () {
        if (knowledge.get('RATING_COUNT') >= 1000) {
            addKnowledge('RATING_COUNT_MODIFIER', 2);
        }
    });
    es.addRule('Rating number degree of trust', function () {
        if (knowledge.get('RATING_COUNT') >= 10000) {
            addKnowledge('RATING_COUNT_MODIFIER', 3);
        }
    });
    es.addRule('Rating number degree of trust', function () {
        if (knowledge.get('RATING_COUNT') >= 100000) {
            addKnowledge('RATING_COUNT_MODIFIER', 5);
        }
    });
    es.addRule('Rating number degree of trust', function () {
        if (knowledge.get('RATING_COUNT') >= 1000000) {
            addKnowledge('RATING_COUNT_MODIFIER', 7);
        }
    });
    es.addRule('Rating number degree of trust', function () {
        if (knowledge.get('RATING_COUNT') >= 10000000) {
            addKnowledge('RATING_COUNT_MODIFIER', 10);
        }
    });
    es.addRule('', function () {
        if (knowledge.get('RATING_COUNT_MODIFIER') !== undefined && knowledge.get('RATING_SCORE') !== undefined) {
            addKnowledge('RATING_TRUST', Math.min(knowledge.get('RATING_SCORE') * 2 + knowledge.get('RATING_COUNT_MODIFIER'), 10));
        }
    });
    es.addRule('location danger', function () {
        if (knowledge.get('INTERNET') && knowledge.get('ACCESS_FINE_LOCATION')) {
            addKnowledge('LOCATION_DANGER', true);
            log('permissions', 'location data at risk');
        }
    });
    es.addRule('network danger', function () {
        if (knowledge.get('INTERNET') && (knowledge.get('ACCESS_NETWORK_STATE'))) {
            addKnowledge('NETWORK_DANGER', true);
            log('permissions', 'network surroundings at risk');
        }
    });
    es.addRule('data mining risk', function () {
        if (knowledge.get('INTERNET') && (knowledge.get('READ_CONTACTS'))) {
            addKnowledge('DATA_DANGER', true);
            log('permissions', 'personal data at risk');
        }
    });
    es.addRule('permissions risk ', function () {
        var permissionErrorCount = 0;
        permissionErrorCount += knowledge.get('DATA_DANGER') === true ? 1 : 0;
        permissionErrorCount += knowledge.get('NETWORK_DANGER') === true ? 1 : 0;
        permissionErrorCount += knowledge.get('LOCATION_DANGER') === true ? 1 : 0;
        permissionErrorCount += knowledge.get('TOO_MANY_PERMISSIONS') === true ? 1 : 0;
        if (true) {
            addKnowledge('PERMISSION_ERRORS', permissionErrorCount);
        }
    });
    es.addRule('install number degree of trust', function () {
        if (knowledge.get('INSTALLS') < 50) {
            addKnowledge('INSTALL_TRUST_MODIFIER', 1);
            log('installs', 'Very Low install count');
        }
    });
    es.addRule('install number degree of trust', function () {
        if (knowledge.get('INSTALLS') >= 1000 && knowledge.get('INSTALLS') < 10000) {
            addKnowledge('INSTALL_TRUST_MODIFIER', .99);
            log('installs', 'low install count');
        }
    });
    es.addRule('install number degree of trust', function () {
        if (knowledge.get('INSTALLS') >= 10000 && knowledge.get('INSTALLS') < 100000) {
            addKnowledge('INSTALL_TRUST_MODIFIER', .87);
        }
    });
    es.addRule('install number degree of trust', function () {
        if (knowledge.get('INSTALLS') >= 100000 && knowledge.get('INSTALLS') < 1000000) {
            addKnowledge('INSTALL_TRUST_MODIFIER', .97);
        }
    });
    es.addRule('install number degree of trust', function () {
        if (knowledge.get('INSTALLS') >= 1000000 && knowledge.get('INSTALLS') < 10000000) {
            addKnowledge('INSTALL_TRUST_MODIFIER', .60);
        }
    });
    es.addRule('install number degree of trust', function () {
        if (knowledge.get('INSTALLS') >= 10000000 && knowledge.get('INSTALLS') < 50000000) {
            addKnowledge('INSTALL_TRUST_MODIFIER', .4);
        }
    });
    es.addRule('install number degree of trust', function () {
        if (knowledge.get('INSTALLS') >= 50000000) {
            addKnowledge('INSTALL_TRUST_MODIFIER', .2);
        }
    });
    es.addRule('permission trust', function () {
        if (knowledge.get('INSTALL_TRUST_MODIFIER') !== undefined && knowledge.get('PERMISSION_ERRORS') !== undefined) {
            addKnowledge('PERMISSION_TRUST', Math.floor(10 - (knowledge.get('PERMISSION_ERRORS') * knowledge.get('INSTALL_TRUST_MODIFIER'))));
        }
    });
    es.addRule('App Trust', function () {
        var total = 0.0;
        var count = 4.0;
        if (knowledge.get('PERMISSION_TRUST')) {
            total += knowledge.get('PERMISSION_TRUST');
        }
        if (knowledge.get('RATING_TRUST')) {
            total += knowledge.get('RATING_TRUST');
        }
        if (knowledge.get('DEVELOPER_TRUST')) {
            total += knowledge.get('DEVELOPER_TRUST');
        }
        else {
            log('Developer Trust', 'Developer not trusted');
        }
        if (knowledge.get('ACTIVE_SCORE')) {
            total += knowledge.get('ACTIVE_SCORE');
        }
        var appScore = total / (0.0 + count);
        addKnowledge('APP_SCORE', appScore);
    });
}
