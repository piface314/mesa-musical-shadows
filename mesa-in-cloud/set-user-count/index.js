'use strict';
const { google } = require('googleapis');
const projectID = 'mesa-musical-shadows';
const cloudRegion = 'europe-west1';
const registryID = 'shadows-decoder';

exports.setUserCount = function (event, context) {
  const { deviceID } = context.params;
  const count = +event.value.fields.count.integerValue;
  console.log(count);
  google.auth.getClient().then(client => {
    google.options({
      auth: client
    });
    const parentName = `projects/${projectID}/locations/${cloudRegion}`;
    const registryName = `${parentName}/registries/${registryID}`;
    const request = {
      name: `${registryName}/devices/${deviceID}`,
      versionToUpdate: 0,
      binaryData: Buffer.from(JSON.stringify(count)).toString('base64')
    };
    return google.cloudiot('v1').projects.locations.registries.devices.modifyCloudToDeviceConfig(request);
  }).then(result => {
    console.log(result.data);
  });
};
