const admin = require('firebase-admin')
const FieldValue = admin.firestore.FieldValue
admin.initializeApp()
var db = admin.firestore()


exports.updateUserCount = (event, context) => {
  const { deviceID } = context.params
  if (!event.oldValue.fields)
    db.doc(`devices/${deviceID}`)
      .update({ usercount: FieldValue.increment(1) })
      .then(res => console.log(res))
  else if (!event.value.fields)
    db.doc(`devices/${deviceID}`)
      .update({ usercount: FieldValue.increment(-1) })
      .then(res => console.log(res))
}
