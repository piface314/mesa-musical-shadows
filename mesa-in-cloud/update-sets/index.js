const { BigQuery } = require('@google-cloud/bigquery')
const bigquery = new BigQuery()

const admin = require('firebase-admin')
const FieldValue = admin.firestore.FieldValue
admin.initializeApp()
var db = admin.firestore()


const shouldUpdate = async docRef => {
  try {
    const snapshot = await docRef.get()
    const lastcheck = snapshot.get('lastcheck')
    if (!lastcheck) return true
    const treshold = 60000 // 1 min
    return Date.now() - lastcheck._seconds * 1000 >= treshold
  } catch(e) {
    return true
  }
}

const fetchAvgs = async deviceID => {
  const nSensors = 2
  const sArray = Array(nSensors).fill(0.0)
  const table = "mesaincloud.reading"
  const rCols = sArray.map((_, i) => `avg(r${i}) a${i}`).reduce((a, b) => a + ',' + b)
  const query =
  `SELECT TIMESTAMP_TRUNC(timestamp, MINUTE) dth, ${rCols}
    FROM ${table}
    WHERE device_id='${deviceID}'
      AND timestamp BETWEEN timestamp_sub(current_timestamp, INTERVAL 1 HOUR)
        AND current_timestamp()
    GROUP BY dth
    ORDER BY dth DESC;`
  try {
    const res = await bigquery.query({ query: query, useLegacySql: false })
    const row = res[0][0]
    return sArray.map((_, i) => row[`a${i}`])
  } catch(e) {
    return sArray
  }
}

const calcSets = avgs => {
  const setsPerSensor = 2
  const delta = 1 / setsPerSensor
  return avgs.map((av, ai) => {
    for (let i = 0; i < setsPerSensor; i++)
      if (av < (i + 1) * delta)
        return ai * setsPerSensor + i
    return (ai + 1) * setsPerSensor - 1
  })
}

const update = async deviceID => {
  const docRef = db.doc(`devices/${deviceID}`)
  const should = await shouldUpdate(docRef)
  if (!should) return null
  const avgs = await fetchAvgs(deviceID)
  const sets = calcSets(avgs)
  return docRef.update({
    sets: sets,
    lastcheck: FieldValue.serverTimestamp()
  })
}

exports.updateSets = (event, context) => {
  const { deviceID } = context.params
  update(deviceID).catch(e => console.log(e))
}
