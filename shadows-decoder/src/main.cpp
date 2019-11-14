#include "Arduino.h"
#include "constants.h"
#include "decoder.h"

void setup() {
  Serial.begin(9600);
  Serial.print("\r\n");
  pinMode(LED, OUTPUT);
  for (int i = 0; i < NSENSORS; i++)
    pinMode(SENSORS[i], INPUT);
  SHDsetup();
}

void loop() {
  SHDloop();
}