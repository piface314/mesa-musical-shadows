#include "decoder.h"

int _users = 0;
int _signals[NSENSORS] = { 0 }; 

void SHDsetup() {
  BLEsetup();
  WIFIsetup();
}

void SHDloop() {
  static unsigned long tprev = 0;
  unsigned long t = millis();
  if (t - tprev > DELAY) {
    tprev = t;
    for (int i = 0; i < NSENSORS; i++)
      _signals[i] = rand() % 1001;
    int *shadows = SHDdecode();
    // tell the cloud
    BLEsend(SHDgetUsers(), shadows);
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