import { getAns } from './TestCodeGeneration/AppES';
var counter = 0;
function tf_perm(n) {
    var k = (1 << n); // bit trick for pow(2, n)

    var truths = [];

    for (var i = 0; i < k; ++i) {
        truths[i] = [];

        for (var j = 0; j < n; ++j) {
            var value = (i >> j) & 1; // extract the j-th bit of i
            truths[i][j] = value;
        }

        ratingScores(truths[i]);
    }
}

function ratingScores(truths) {
    var data = truths.slice();
    for (let x = 0; x <= 5; x++) {
        let newval = data.slice();
        newval.push(x);
        ratingCounts(newval);
    }
}

function ratingCounts(truth_ratings) {
    var data = truth_ratings.slice();

    for (let x = 11; x <= 10000000; x = x * 10) {

        let newval = data.slice();
        newval.push(x);
        installs(newval);

    }
}

function installs(truths_ratings_count) {
    var data = truths_ratings_count.slice();

    for (let x = 10; x <= 100000000; x = x * 10) {
        let newval = data.slice();
        newval.push(x);
        print(newval);
    }
}


function print(data) {
    data.push(getAns(data));
    console.log(data.join(','));
}

console.log('IS_AVALABLE,PRIVACY_MATCH_WEBSITE,EMAIL_MATCH_WEBSITE,EMAIL_IS_COMMON,PERMISSON_COUNT,INTERNET,HAS_BEEN_UPDATED,RECIENTLY_UPDATED,UPDATED_PAST_YEAR,ACCESS_FINE_LOCATION,ACCESS_NETWORK_STATE,READ_CONTACTS,RATING_SCORE,INSTALLS,RATING_COUNT,SCORE');
tf_perm(12);
