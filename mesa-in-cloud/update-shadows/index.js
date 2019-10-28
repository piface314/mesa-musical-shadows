const admin = require('firebase-admin');
const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();
admin.initializeApp();
var db = admin.firestore();

function insertIntoBigquery(data, deviceId) {
  const dataset = bigquery.dataset('mesaincloud');
  const table = dataset.table('shadows');
  const tdata = {
    deviceId: deviceId,
    timestamp: data.timestamp,
    shadow0: data.values[0],
    shadow1: data.values[1],
    shadow2: data.values[2],
    shadow3: data.values[3],
    shadow4: data.values[4],
    shadow5: data.values[5],
    shadow6: data.values[6]
  };
  return table.insert(tdata);
}

exports.updateShadows = (event, callback) => {
  const { attributes, data } = event;
  const { deviceId } = attributes;
  if (!data) {
    throw new Error('No shadow data was provided!');
  }
  const payload = Buffer.from(data, 'base64').toString();
  const fdata = {
    'values': JSON.parse(payload),
    'timestamp': new Date()
  };
  db.collection(`devices/${deviceId}/shadows`).add(fdata)
    //.then(res => console.log(res))
    .catch(err => console.log(err));
  insertIntoBigquery(fdata, deviceId);
};
