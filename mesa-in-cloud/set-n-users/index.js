'use strict';
const { google } = require('googleapis');

const projectId = 'mesa-musical-shadows';
const cloudRegion = 'europe-west1';
const registryId = 'shadows-decoder';

exports.setNUsers = function (event, callback) {
  const nUsers = event.data;
  console.log(nUsers);

  google.auth.getClient().then(client => {
    google.options({
      auth: client
    });
    const parentName = `projects/${projectId}/locations/${cloudRegion}`;
    const registryName = `${parentName}/registries/${registryId}`;
    const request = {
      name: `${registryName}/devices/${config.deviceId}`,
      versionToUpdate: 0,
      binaryData: nUsers
    };
    return google.cloudiot('v1').projects.locations.registries.devices.modifyCloudToDeviceConfig(request);
  }).then(result => {
    console.log(result);
    console.log(result.data);
  });
};
