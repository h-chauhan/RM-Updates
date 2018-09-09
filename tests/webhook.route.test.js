var request = require('supertest');
var app = require('../app');

describe('Webhook tests', function () {

    before(function (done) {
        app.listen(function (err) {
            if (err) {
                return done(err);
            }
            done();
        })
    })

    it('verify webhook should return 200 status', function (done) {
        request(app)
            .get('/webhook?hub.verify_token=MpXISTOCoehGQ1vGHddl&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe')
            .expect(200, done);
    });

    it('post to webhook should return 200 status', function (done) {
        request(app)
            .post('/webhook')
            .set('Content-Type', 'application/json')
            .send({
                "object": "page",
                "entry": [{
                    "messaging": [{
                        sender: {
                            id: process.env.TEST_RECIPIENT_ID
                        },
                        message: {
                            text: "Congratulations! Your tests worked!!!"
                        }
                    }]
                }]
            })
            .expect(200, done);
    });
});