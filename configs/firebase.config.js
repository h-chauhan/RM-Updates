const admin = require('firebase-admin');

var serviceAccount = require('./service.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
const settings = {
    timestampsInSnapshots: true
};
db.settings(settings);

module.exports = db;