#ifndef MMS_BLE_H
#define MMS_BLE_H

#include "Arduino.h"

#include <string>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#include "constants.h"
#include "wifi-mgr.h"

using namespace std;

void BLEsetup();
void BLEsend(string info, shadow_t *shadows);
void onWriteCred(string data, int sel);

#endif