const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;
admin.initializeApp();
var db = admin.firestore();
exports.adjustUserCount = function (event, context) {
  if (!event.oldValue.fields)
    db.doc("counters/users").update({ count: FieldValue.increment(1) })
      .then(res => console.log(res));
  else if (!event.value.fields)
    db.doc("counters/users").update({ count: FieldValue.increment(-1) })
      .then(res => console.log(res));
};
