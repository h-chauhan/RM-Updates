const Browser = require('zombie');
const rmConfig = require('../config/rmConfig');

const cheerio = require('cheerio');

const firebase = require('../config/firebaseConfig');
const database = firebase.database();
const internNewsRef = database.ref('internNews/');


function pullRM() {
    const browser = new Browser();

    return browser.visit(rmConfig.internLoginUrl).then(function () {
        browser.fill("input#intern_student_username_rollnumber", rmConfig.internUsername);
        browser.fill("input#intern_student_password", rmConfig.internPassword);
        browser.document.forms[0].submit();
        return browser.wait().then(function () {
            console.log('Form submitted ok!');
            return browser.visit(rmConfig.internNewsFeedUrl).then(function() {
                let $ = cheerio.load(browser.html());
            });
        });
    });
}

module.exports = pullRM;