#ifndef SHADOWS_WIFI_H
#define SHADOWS_WIFI_H

#include "Arduino.h"
#include "WiFi.h"

#define MAXATTEMPTS 10

typedef enum { DISCONNECTED, ATTEMPTING, CONNECTED } WiFiState;

extern char wifiSSID[21];
extern char wifiPSWD[21];

void WIFIloop();

#endif