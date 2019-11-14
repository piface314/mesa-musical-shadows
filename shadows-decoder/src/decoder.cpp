#include "decoder.h"

string _info = "";

void SHDsetup() {
  WIFIsetup();
  IOTsetup(SHDsetInfo);
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
    BLEsend(SHDgetInfo(), shadows);
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
  }
  return shadows;
}

string SHDgetInfo() {
  return _info;
}

void SHDsetInfo(String info) {
  char c; int i;
  for (i = 0; c = info[i]; ++i)
    _info[i] = c;
  _info[i] = c;
}