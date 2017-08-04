const Browser = require('zombie');
const rmConfig = require('../config/rmConfig');

const cheerio = require('cheerio');

const firebase = require('../config/firebaseConfig');
const database = firebase.database();
const newsRef = database.ref('news/');


function pullRM() {
    const browser = new Browser();

    return browser.visit(rmConfig.loginUrl).then(function () {
        browser.fill("input#student_username_rollnumber", rmConfig.username);
        browser.fill("input#student_password", rmConfig.password);
        browser.document.forms[0].submit();
        return browser.wait().then(function () {
            console.log('Form submitted ok!');
            return browser.visit(rmConfig.newsFeedUrl).then(function() {
                let $ = cheerio.load(html);
            });
        });
    });
}

module.exports = pullRM;