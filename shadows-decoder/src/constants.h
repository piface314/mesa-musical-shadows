#ifndef MMS_CONST_H
#define MMS_CONST_H

typedef uint16_t shadow_t;

const uint8_t LED = 2;

const int NSENSORS = 2;
const uint8_t SENSORS[NSENSORS] = { 36, 34 };

const int DATA_SIZE = 21;
const int EEPROM_SIZE = DATA_SIZE << 1;

const int DELAY = 1000;

const unsigned long SHADOW_LOWER = 100;
const unsigned long SHADOW_UPPER = 2000;
const unsigned long SHADOW_RANGE = SHADOW_UPPER - SHADOW_LOWER;

#endif