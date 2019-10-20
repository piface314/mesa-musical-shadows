#include "wifi-mgr.h"

char _ssid[DATA_SIZE], _pass[DATA_SIZE];

void _onConnect(WiFiEvent_t event, WiFiEventInfo_t info) {
  digitalWrite(LED, HIGH);
  IOTonConnect();
}

void _onDisconnect(WiFiEvent_t event, WiFiEventInfo_t info) {
  digitalWrite(LED, LOW);
}

void WIFIsetup() {
  MEMsetup(_ssid, _pass);
  WiFi.mode(WIFI_STA);
  WiFi.begin(_ssid, _pass);
  WiFi.onEvent(_onConnect, SYSTEM_EVENT_STA_CONNECTED);
  WiFi.onEvent(_onDisconnect, SYSTEM_EVENT_STA_DISCONNECTED);
  Serial.println("Setup WiFi!");
}

bool WIFIisConnected() {
  return WiFi.isConnected();
}

void WIFIsetCredentials(char ssid[DATA_SIZE], char pass[DATA_SIZE]) {
  for (int i = 0; i < DATA_SIZE; i++) {
    _ssid[i] = ssid[i];
    _pass[i] = pass[i];
  }
  WiFi.begin(_ssid, _pass);
  MEMsave(_ssid, _pass);
}