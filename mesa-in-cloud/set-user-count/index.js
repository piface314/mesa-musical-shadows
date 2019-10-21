'use strict';
const { google } = require('googleapis');
const projectId = 'mesa-musical-shadows';
const cloudRegion = 'europe-west1';
const registryId = 'shadows-decoder';
const deviceId = 'shadows-decoder-device';

exports.setUserCount = function (event, context) {
  const count = +event.value.fields.count.integerValue;
  console.log(count);
  google.auth.getClient().then(client => {
    google.options({
      auth: client
    });
    const parentName = `projects/${projectId}/locations/${cloudRegion}`;
    const registryName = `${parentName}/registries/${registryId}`;
    const request = {
      name: `${registryName}/devices/${deviceId}`,
      versionToUpdate: 0,
      binaryData: Buffer.from(JSON.stringify(count)).toString('base64')
    };
    return google.cloudiot('v1').projects.locations.registries.devices.modifyCloudToDeviceConfig(request);
  }).then(result => {
    console.log(result);
    console.log(result.data);
  });
};
