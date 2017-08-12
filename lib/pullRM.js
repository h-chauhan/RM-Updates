const Browser = require('zombie');
const rmConfig = require('../config/rmConfig');

const cheerio = require('cheerio');

const firebase = require('../config/firebaseConfig');
const database = firebase.database();
const newsRef = database.ref('news/');

const hashCode = require('./hashCode');

Browser.waitDuration = '30s';

module.exports = function () {
    const browser = new Browser({
        maxWait: 10000,
        waitDuration: 30 * 1000,
        silent: true
    });

    // browser.debug();
    browser.visit(rmConfig.loginUrl, function (err) {
        if (!err) {
            console.log("Login Page loaded: ", browser.location.href);
            browser.fill("input#student_username_rollnumber", rmConfig.username);
            browser.fill("input#student_password", rmConfig.password);
            browser.document.forms[0].submit();

            browser.wait().then(function () {
                console.log("Form submitted OK! Now at: ", browser.location.href);
                browser.visit(rmConfig.newsFeedUrl, function () {
                    console.log("Notifications loaded OK! ", browser.location.href);
                    let $ = cheerio.load(browser.html());
                    let li_time_label = $("ul.timeline li.time-label");
                    let div_timeline_item = $("ul.timeline div.timeline-item");

                    li_time_label.each(function (i, item) {
                        let date = $(item).text().trim();
                        let time = $("span.time", div_timeline_item[i]).text().trim();
                        let header = $("h4.timeline-header", div_timeline_item[i]).text().trim();
                        let body = $("div.timeline-body", div_timeline_item[i]).text().trim();
                        let poster = $("h3.timeline-header", div_timeline_item[i]).text().trim()
                            .split("Posted by : \n              \n              ").pop();

                        let key = hashCode(date + time + header + body.substr(0, 5));
                        newsRef.child(key).child("notification").set({
                            date: date,
                            time: time,
                            header: header,
                            body: body,
                            poster: poster
                        });
                    });
                });
            });
        }
    });
}