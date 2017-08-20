const request = require('request');

const hashCode = require('./hashCode');
const rmConfig = require('../config/rmConfig');
const firebase = require('../config/firebaseConfig');
const database = firebase.database();
const jobsRef = database.ref('jobs/');

module.exports = function () {
    request(rmConfig.jobsUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Jobs loaded OK!");
            result = JSON.parse(body);
            for (let i = 0; i < result.length; i++) {
                let key = hashCode(result[i].name);
                jobsRef.child(key).child("job").set({
                    name: result[i].name,
                    appDeadline: result[i].appDeadline,
                    dateOfVisit: result[i].dateOfVisit,
                    link: result[i].link
                });
            }
        } else if (response) {
            console.log(response.statusCode);
        } else {
            console.error(error);
        }
    });
}