var rp = require('request-promise');

var textOptions = function (id, msg) {
    return {
        uri: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN,
        method: 'POST',
        json: {
            "messaging_type": "UPDATE",
            "recipient": {
                "id": id,
            },
            "message": {
                "text": msg,
            }
        }
    };
};

var urlOptions = function (id, txt, url, btn_title) {
    return {
        uri: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN,
        method: 'POST',
        json: {
            "recipient": {
                "id": id
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": txt,
                        "buttons": [{
                            "type": "web_url",
                            "url": url,
                            "title": btn_title
                        }]
                    }
                }
            }
        }
    };
};

var sendTxtMessage = function (id, msg) {
    return new Promise((resolve, reject) => {
        rp(textOptions(id, msg))
            .then((body) => resolve(body))
            .catch((err) => reject(err));
    })
}

var sendUrlMessage = function (id, txt, url, btn_title) {
    return new Promise((resolve, reject) => {
        rp(urlOptions(id, txt, url, btn_title))
            .then((body) => resolve(body))
            .catch((err) => reject(err));
    })
}

module.exports = {
    sendTxtMessage,
    sendUrlMessage
};