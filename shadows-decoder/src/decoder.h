#ifndef MMS_SHD_H
#define MMS_SHD_H

#include "Arduino.h"
#include "constants.h"
#include "ble-mgr.h"
#include "wifi-mgr.h"
#include "iot-mgr.h"

void SHDsetup();
void SHDloop();
shadow_t *SHDdecode();

string SHDgetInfo();
void SHDsetInfo(String info);

#endif