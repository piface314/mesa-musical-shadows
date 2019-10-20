#include "eeprom-mgr.h"

void MEMsetup(char *ssid, char *pass) {
  EEPROM.begin(EEPROM_SIZE);
  MEMload(ssid, pass);
}

void MEMload(char *ssid, char *pass) {
  EEPROM.readBytes(0, ssid, DATA_SIZE);
  EEPROM.readBytes(DATA_SIZE, pass, DATA_SIZE);
  Serial.print("SSID: "); Serial.println(ssid);
  Serial.print("PASS: "); Serial.println(pass);
}

void MEMsave(char *ssid, char *pass) {
  EEPROM.writeString(0, ssid);
  EEPROM.writeString(DATA_SIZE, pass);
  Serial.print("save SSID: "); Serial.println(ssid);
  Serial.print("save PASS: "); Serial.println(pass);
  EEPROM.commit();
}