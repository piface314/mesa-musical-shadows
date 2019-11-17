#ifndef MMS_MEM_H
#define MMS_MEM_H

#include <EEPROM.h>

#include "constants.h"

void MEMsetup(char *ssid, char *pass);
void MEMload(char *ssid, char *pass);
void MEMsave(char *ssid, char *pass);

#endif