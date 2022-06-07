"use strict";
exports.__esModule = true;
var GeneralES_1 = require("./TestCodeGeneration/GeneralES");
function tf_perm(n) {
    var k = (1 << n); // bit trick for pow(2, n)
    var truths = [];
    for (var i = 0; i < k; ++i) {
        truths[i] = [];
        for (var j = 0; j < n; ++j) {
            var value = (i >> j) & 1; // extract the j-th bit of i
            truths[i][j] = value;
        }
        appCount(truths[i]);
    }
}
function appCount(truths) {
    var data = truths.slice();
    for (var x = 0; x <= 120; x += 2) {
        var newval = data.slice();
        newval.push(x);
        osVersion(newval);
    }
}
function osVersion(truth_app_count) {
    var data = truth_app_count.slice();
    for (var x = 1; x <= 13; x++) {
        var newval = data.slice();
        newval.push(x);
        appAvgScore(newval);
    }
}
function appAvgScore(truth_app_os) {
    var data = truth_app_os.slice();
    for (var x = 0.0; x <= 10; x += .2) {
        var y = (Math.round(((x) + Number.EPSILON) * 100) / 100.0);
        var newval = data.slice();
        newval.push(x);
        print(newval);
    }
}
function print(data) {
    var mydata = data.slice();
    var newdata = GeneralES_1.generalESRun(data);
    mydata[6] = (Math.round(((mydata[6]) + Number.EPSILON) * 100) / 100.0);
    mydata.push(newdata);
    console.log(mydata.join(','));
}
console.log('UNSAFE_MANUFACTURER,EMAIL_MATCH_WEBSITE,TOO_MANY_HIGH_RISK_APPS,TOO_MANY_MED_RISK_APPS,APP_COUNT,ANDROID_OS_VERSION,APP_AVG_SCORE,DEVCIE_SCORE');
tf_perm(4);
