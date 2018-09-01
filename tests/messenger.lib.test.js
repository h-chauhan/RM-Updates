var messenger = require('../libs/messenger');
var expect = require('chai').expect;

describe("Messenger", function () {
    let id, msg, url, btn_title;

    before(function (done) {
        id = process.env.TEST_RECIPIENT_ID;
        msg = "Congratulations! Your tests worked!!!";
        url = "http://dturmupdates.me";
        btn_title = "Open DTU RM Updates"
        done();
    });

    it('sendTxtMessage should return response with msg id;', function (done) {
        messenger.sendTxtMessage(id, msg).then((result) => {
            expect(result.message_id).to.exist;
            done();
        });
    });

    it('sendUrlMessage should return response with msg id;', function (done) {
        messenger.sendUrlMessage(id, msg, url, btn_title).then((result) => {
            expect(result.message_id).to.exist;
            done();
        });
    });
});