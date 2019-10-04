#include "Arduino.h"
#include "shadows-ble.h"
#include "shadows-wifi.h"

using namespace std;

void setup() {
  Serial.begin(9600);
  BLEsetup();
}

void loop() {
  BLEloop();
  WIFIloop();
  delay(1000);
}