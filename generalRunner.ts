import { generalESRun } from './TestCodeGeneration/GeneralES';

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
function appCount(truths){
    var data = truths.slice();
    for (let x = 0; x <= 120; x += 2) {
        let newval = data.slice();
        newval.push(x);
        osVersion(newval);
    }
}

function osVersion(truth_app_count){
    var data = truth_app_count.slice();
    for (let x = 1; x <= 13; x++) {
        let newval = data.slice();
        newval.push(x);
        appAvgScore(newval);
    }
}
function appAvgScore(truth_app_os){
    var data = truth_app_os.slice();
    for (let x = 0.0; x <= 10; x += .2) {
        let y = (Math.round(((x) + Number.EPSILON) * 100) / 100.0);
        let newval = data.slice();
        newval.push(x);
        print(newval);
    }
}

function print(data:any){
    let mydata = data.slice();
    var newdata = Math.round(generalESRun(data));
    mydata[6] = Math.round(mydata[6]);
    mydata.push(newdata);
    console.log(mydata.join(','));
}

tf_perm(4);
