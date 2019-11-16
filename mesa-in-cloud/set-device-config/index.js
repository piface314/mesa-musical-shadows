const { google } = require('googleapis')
const projectID = 'mesa-musical-shadows'
const cloudRegion = 'europe-west1'
const registryID = 'shadows-decoder'


exports.setDeviceConfig = (event, context) => {
  google.auth.getClient().then(client => {
    google.options({ auth: client })
    const { deviceID } = context.params
    let { usercount, sets } = event.value.fields
    usercount = +usercount.integerValue
    sets = sets.arrayValue.values.map(v => +v.integerValue)
    const parentName = `projects/${projectID}/locations/${cloudRegion}`
    const registryName = `${parentName}/registries/${registryID}`
    const data = [ usercount, sets ]
    const request = {
      name: `${registryName}/devices/${deviceID}`,
      versionToUpdate: 0,
      binaryData: Buffer.from(JSON.stringify(data)).toString('base64')
    }
    return google.cloudiot('v1').projects.locations.registries.devices
      .modifyCloudToDeviceConfig(request)
  }).then(res => console.log(res.data))
}
