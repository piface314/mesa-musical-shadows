const { BigQuery } = require('@google-cloud/bigquery')
const bigquery = new BigQuery()

const admin = require('firebase-admin')
const FieldValue = admin.firestore.FieldValue
admin.initializeApp()
var db = admin.firestore()


const bounds = [[1, 1], [2, 4], [4, 8]]
const m = bounds.length
const getMult = u => bounds.map(([i, j]) => u < i ? 0 : u < j ? u / j : 1)
const toShadows = (nUsers, sets, readings) => {
  const n = readings.length, setsPerSensor = 2
  const shadows = Array(n * setsPerSensor * m).fill(0.0)
  const multipliers = getMult(nUsers)
  sets.forEach(s => {
    const r = readings[Math.floor(s / setsPerSensor)]
    const k = s * m
    multipliers.forEach((mul, i) => shadows[k + i] = r * mul)
  })
  return shadows
}

const sendToFirestore = async (deviceId, shadows) => {
  const doc = { timestamp: FieldValue.serverTimestamp(), values: shadows }
  return db.collection(`devices/${deviceId}/shadows`).add(doc)
}

const sendToBigQuery = async (deviceId, readings) => {
  const dataset = bigquery.dataset('mesaincloud')
  const table = dataset.table('reading')
  let row = { device_id: deviceId, timestamp: new Date() }
  readings.forEach((r, i) => row = { ...row, ['r' + i]: r })
  return table.insert(row)
}

exports.addShadow = (event, context) => {
  const { attributes, data } = event
  const { deviceId } = attributes
  if (!data)
    throw new Error('No data was provided!')
  const payload = Buffer.from(data, 'base64').toString()
  let [ info, readings ] = payload.split(',').map(sp => sp.split(' ').map(n => +n))
  let nUsers = info[0], sets = info.slice(1)
  readings = readings.map(r => r / 1000.0)
  const shadows = toShadows(nUsers, sets, readings)
  sendToFirestore(deviceId, shadows).catch(e => console.log(e))
  sendToBigQuery(deviceId, readings).catch(e => console.log(e))
}

/* TEST:
{
  "attributes": {
    "deviceId": "ufv-device"
  },
  "data": "NCAzIDIsMTA5IDg3Ng=="
}
*/
