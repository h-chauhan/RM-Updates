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

var quickReplyOptions = function (id, msg, quickReplies) {
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
                "quick_replies": quickReplies.map(convertToMessengerQuickReply)
            }
        }
    };
};

var convertToMessengerQuickReply = function(txt) {
    return {
        "content_type": "text",
        "title": txt,
        "payload": txt
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

var getSenderNameOptions = function (id) {
    return {
        uri: 'https://graph.facebook.com/v2.6/' + id + '?fields=first_name,last_name&access_token=' +
            process.env.PAGE_ACCESS_TOKEN,
        method: 'GET'
    };
};

var sendTxtMessage = function (id, msg) {
    return new Promise((resolve, reject) => {
        rp(textOptions(id, msg))
            .then((body) => resolve(body))
            .catch((err) => reject(err));
    });
};

var sendUrlMessage = function (id, txt, url, btn_title) {
    return new Promise((resolve, reject) => {
        rp(urlOptions(id, txt, url, btn_title))
            .then((body) => resolve(body))
            .catch((err) => reject(err));
    });
};

var sendMessageWithQuickReplies = function (id, txt, quickReplies) {
    return new Promise((resolve, reject) => {
        rp(quickReplyOptions(id, txt, quickReplies))
            .then((body) => resolve(body))
            .catch((err) => reject(err));
    });
};

var getSenderName = function (id) {
    return new Promise((resolve, reject) => {
        rp(getSenderNameOptions(id)).then((body) => {
            result = JSON.parse(body);
            resolve(result.first_name + " " + result.last_name);
        }).catch((err) => reject(err));
    });
};

module.exports = {
    sendTxtMessage,
    sendUrlMessage,
    sendMessageWithQuickReplies,
    getSenderName,
};