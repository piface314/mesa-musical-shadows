const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;
admin.initializeApp();
var db = admin.firestore();

exports.adjustUserCount = function (event, context) {
  const { deviceID } = context.params;
  if (!event.oldValue.fields)
    db.doc(`devices/${deviceID}/counters/users`)
      .update({ count: FieldValue.increment(1) })
      .then(res => console.log(res));
  else if (!event.value.fields)
    db.doc(`devices/${deviceID}/counters/users`)
      .update({ count: FieldValue.increment(-1) })
      .then(res => console.log(res));
};
