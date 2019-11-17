#include "decoder.h"

string _config;

void SHDsetup() {
  WIFIsetup();
  IOTsetup(&_config);
}

const int BLEDELAY = DELAY * 10;
void SHDloop() {
  static unsigned long tprev = 0, tstart = millis();
  static bool isBLEPending = true;
  unsigned long t = millis();
  bool connectedWiFi = WIFIisConnected();
  IOTloop(connectedWiFi);
  if (t - tprev > DELAY) {
    tprev = t;
    shadow_t *shadows = SHDdecode();
    if (connectedWiFi)
      IOTsend(shadows);
    BLEsend(_config, shadows);
  }
  if (isBLEPending && t - tstart > BLEDELAY) {
    isBLEPending = false;
    BLEsetup();
  }
}

shadow_t *SHDdecode() {
  static shadow_t shadows[NSENSORS];
  for (int i = 0; i < NSENSORS; i++) {
    unsigned long r = analogRead(SENSORS[i]);
    if (r < SHADOW_LOWER)
      r = SHADOW_LOWER;
    else if (r > SHADOW_UPPER)
      r = SHADOW_UPPER;
    shadows[i] = (shadow_t)(((r - SHADOW_LOWER) * 1000ul) / SHADOW_RANGE);
    Serial.printf("Sensor %d: ", i); Serial.println(shadows[i]);
  }
  return shadows;
}