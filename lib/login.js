const Browser = require('zombie');
const Promise = require('promise');
const rmConfig = require('../config/rmCOnfig');


function login() {
    const browser = new Browser();

    return browser.visit(rmConfig.loginUrl).then(function () {
        browser.fill("input#intern_student_username_rollnumber", rmConfig.username);
        browser.fill("input#intern_student_password", rmConfig.password);
        browser.document.forms[0].submit();
        return browser.wait().then(function () {
            console.log('Form submitted ok!');
            return browser.visit(rmConfig.newsFeedUrl).then(function() {
                return browser.html();
            });
        });
    });
}

module.exports = login;