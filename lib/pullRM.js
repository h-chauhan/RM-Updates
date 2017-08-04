const Browser = require('zombie');
const connector = require('../config/botConfig');
const builder = require('botbuilder');
const rmConfig = require('../config/rmConfig');

const cheerio = require('cheerio');

const firebase = require('../config/firebaseConfig');
const database = firebase.database();
const newsRef = database.ref('news/');
const userRef = database.ref('users/');
let userSnap = null;

function hashCode(str) {
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

const bot = new builder.UniversalBot(connector);

function pullRM() {
    const browser = new Browser();

    return browser.visit(rmConfig.loginUrl).then(function () {
        browser.fill("input#student_username_rollnumber", rmConfig.username);
        browser.fill("input#student_password", rmConfig.password);
        browser.document.forms[0].submit();
        return browser.wait().then(function () {
            console.log('Form submitted ok!');
            return browser.visit(rmConfig.newsFeedUrl).then(function () {
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
                    let newsItem = newsRef.child(key);
                    newsItem.child("date").set(date);
                    newsItem.child("time").set(time);
                    newsItem.child("header").set(header);
                    newsItem.child("body").set(body);
                    newsItem.child("poster").set(poster);
                })
            });
        });
    }).catch(function (reason) {
        console.log(reason.message);
    });
}

newsRef.on('child_added', function (snapshot) {
    if (!snapshot.hasChild("createdAt")) {
        newsRef.child(snapshot.key).child("createdAt")
            .set(firebase.database.ServerValue.TIMESTAMP);
    }
});

userRef.on('value', function (snapshot) {
    userSnap = snapshot;
});

newsRef.orderByChild("createdAt").limitToLast(1).on('child_added', function (snapshot) {
    if (userSnap !== null) {
        userSnap.forEach(function (user) {
            bot.send(new builder.Message()
                .text("Notification Update:\n" +
                    "---\n" +
                    snapshot.val().date + " " + snapshot.val().time + "\n" + 
                    (snapshot.val().header !== undefined ? "---\n" +
                    snapshot.val().header + "\n" : "") +
                    (snapshot.val().body !== undefined ? "---\n" +
                    snapshot.val().body.substr(0, 25) + "...\n" : "") +
                    "---\n" + 
                    "Posted By: " + snapshot.val().poster)
                .address(user.val().address));
        });
    }
});

module.exports = pullRM;