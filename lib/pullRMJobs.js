const Browser = require('zombie');
const rmConfig = require('../config/rmConfig');

const cheerio = require('cheerio');

const firebase = require('../config/firebaseConfig');
const database = firebase.database();
const jobsRef = database.ref('jobs/');

const hashCode = require('./hashCode');

Browser.waitDuration = '30s';

module.exports = function () {
    const browser = new Browser({
        maxWait: 10000,
        waitDuration: 30 * 1000,
        silent: true
    });

    browser.visit(rmConfig.loginUrl, function (err) {
        if (!err) {
            console.log("Login Page loaded: ", browser.location.href);
            browser.fill("input#student_username_rollnumber", rmConfig.username);
            browser.fill("input#student_password", rmConfig.password);
            browser.document.forms[0].submit();

            browser.wait().then(function () {
                console.log("Form submitted OK! Now at: ", browser.location.href);
                browser.visit(rmConfig.jobsUrl, function () {
                    console.log("Jobs loaded OK! ", browser.location.href);
                    let $ = cheerio.load(browser.html());
                    let tr_jobs = $("#jobs_search tr");

                    tr_jobs.each(function (i, item) {
                        // First row is table headers. 
                        // Idiots didn't use <th> for table headers.
                        if (i > 0) {
                            let companyName = $($(item).children()[0]).text();
                            let appDeadline = $($(item).children()[2]).text();
                            let dateOfVisit = $($(item).children()[6]).text();
                            let link = $(item).attr('onclick')
                                .replace("void window.open('", "").replace("')", "");
                            let openForBTech =
                                $($(item).children()[3]).html() === '<i class="fa fa-check"></i>';

                            if (openForBTech) {
                                let key = hashCode(companyName);
                                jobsRef.child(key).child("job").set({
                                    name: companyName,
                                    appDeadline: appDeadline,
                                    dateOfVisit: dateOfVisit,
                                    link: link
                                });
                            }
                        }
                    });
                });
            });
        } else {
            console.error(err);
        }
    });
}