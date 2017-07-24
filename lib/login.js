const Browser = require('zombie');
const Promise = require('promise');
const rmConfig = require('../config/rmCOnfig');


function login() {
    const browser = new Browser();

    return browser.visit(rmConfig.loginUrl).then(function () {
        browser.fill("input#id_username", rmConfig.username);
        browser.fill("input#id_password", rmConfig.password);
        browser.document.forms[0].submit();
        return browser.wait().then(function () {
            console.log('Form submitted ok!');
            return new Promise(function (resolve, reject) {
                resolve(browser.html());
            })
        });
    });
}

module.exports = login;