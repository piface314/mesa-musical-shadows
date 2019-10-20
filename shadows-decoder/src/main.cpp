#include "Arduino.h"
#include "constants.h"
#include "decoder.h"

void setup() {
  Serial.begin(9600);
  Serial.print("\r");
  pinMode(LED, OUTPUT);
  SHDsetup();
}

void loop() {
  SHDloop();
}