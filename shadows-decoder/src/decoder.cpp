#include "decoder.h"

int _users = 0;
int _signals[NSENSORS] = { 0 }; 

void SHDsetup() {
  WIFIsetup();
  IOTsetup(SHDsetUsers);
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
    for (int i = 0; i < NSENSORS; i++)
      _signals[i] = rand() % 1001;
    int *shadows = SHDdecode();
    if (connectedWiFi)
      IOTsend(shadows);
    BLEsend(SHDgetUsers(), shadows);
  }
  if (isBLEPending && t - tstart > BLEDELAY) {
    isBLEPending = false;
    BLEsetup();
  }
}

int _shadows[NSENSORS * NSETS];
int mod[NSETS] = { 1001, 801, 601, 401, 201 };
int *SHDdecode() {
  for (int i = 0; i < NSENSORS; i++)
    for (int j = 0; j < NSETS; j++)
      _shadows[NSETS * i + j] = _signals[i] % mod[j];
  return _shadows;
}

int SHDgetUsers() {
  return _users;
}

void SHDsetUsers(int users) {
  _users = users;
}