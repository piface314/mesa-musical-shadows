const admin = require('firebase-admin');
admin.initializeApp();
var db = admin.firestore();

exports.updateShadows = (event, callback) => {
  const pubsubMessage = event.data;
  if (!pubsubMessage) {
    throw new Error('No shadow data was provided!');
  }
  const payload = Buffer.from(pubsubMessage, 'base64').toString();
  db.doc(`shadows/values`).update({
    'sensors': JSON.parse(payload)
  })
    .then(res => console.log('Message with ID: ' + res.id + ' added.'))
    .catch(err => console.log(err));
};
