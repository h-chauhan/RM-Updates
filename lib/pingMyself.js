const Browser = require('zombie');

Browser.waitDuration = '30s';

module.exports = function () {
    const browser = new Browser({
        maxWait: 10000,
        waitDuration: 30 * 1000,
        silent: true
    });

    // browser.debug();
    browser.visit("http://rm-bot.azurewebsites.net/", function (err) {
        if (!err) {
            console.log("Pinged Myself", browser.html());
        }
    });
}