#include "shadows-wifi.h"

char wifiSSID[21] = "";
char wifiPSWD[21] = "";

WiFiState connectedWiFi = DISCONNECTED;
int attempts = 0;

void WIFIloop() {
  if (connectedWiFi == CONNECTED) {
    
  } else if (connectedWiFi == ATTEMPTING) {
    if (WiFi.isConnected()) {
      Serial.println("Connected!");
      Serial.print("IP: ");
      Serial.println(WiFi.localIP());
      connectedWiFi = CONNECTED;
    } else {
      attempts++;
      if (attempts >= MAXATTEMPTS) {
        attempts = 0;
        connectedWiFi = DISCONNECTED;
        WiFi.disconnect();
      }
    }
  } else if (wifiSSID[0] && wifiPSWD[0]) {
    WiFi.begin(wifiSSID, wifiPSWD);
    connectedWiFi = ATTEMPTING;
  }
}