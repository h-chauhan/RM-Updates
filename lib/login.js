const Browser = require('zombie');
const rmConfig = require('../config/rmCOnfig');


function login() {
    const browser = new Browser();

    browser.visit(rmConfig.loginUrl, function () {
        browser.fill("input#id_username", rmConfig.username);
        browser.fill("input#id_password", rmConfig.password);
        browser.document.forms[0].submit();
        browser.wait().then(function () {
            console.log('Form submitted ok!');
            // the resulting page will be displayed in your default browser
            // browser.viewInBrowser();
            console.log(browser.html());
        });
    })
}

module.exports = (login)();