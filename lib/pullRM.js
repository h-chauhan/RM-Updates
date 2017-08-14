const Browser = require('zombie');
const rmConfig = require('../config/rmConfig');

const cheerio = require('cheerio');

const firebase = require('../config/firebaseConfig');
const database = firebase.database();
const newsRef = database.ref('news/');

const hashCode = require('./hashCode');

Browser.waitDuration = '60s';

module.exports = function () {
    const browser = new Browser({
        maxWait: 60000,
        waitDuration: 60 * 1000,
        silent: true
    });

    // browser.debug();
    browser.visit(rmConfig.newsFeedUrl, function (err) {
        if (!err) {
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
        } else {
            console.error(err);
        }
    });
}