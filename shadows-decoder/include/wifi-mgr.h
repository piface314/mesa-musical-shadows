#ifndef MMS_WIFI_H
#define MMS_WIFI_H

#include "Arduino.h"
#include "WiFi.h"

#include "constants.h"
#include "iot-mgr.h"
#include "eeprom-mgr.h"

void WIFIsetup();
bool WIFIisConnected();
void WIFIsetCredentials(char ssid[DATA_SIZE], char pass[DATA_SIZE]);

#endif