#ifndef MMS_SHD_H
#define MMS_SHD_H

#include "Arduino.h"
#include "constants.h"
#include "ble-mgr.h"
#include "wifi-mgr.h"

const int DELAY = 1000;

void SHDsetup();
void SHDloop();
int* SHDdecode();

int  SHDgetUsers();
void SHDsetUsers(int users);

#endif