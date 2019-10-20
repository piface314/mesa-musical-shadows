#ifndef MMS_IOT_H
#define MMS_IOT_H

#include "Arduino.h"

#include <Client.h>
#include <WiFiClientSecure.h>

#include <MQTT.h>

#include <CloudIoTCore.h>
#include <CloudIoTCoreMqtt.h>

#include "constants.h"
#include "iot-config.h"

extern Client *netClient;
extern CloudIoTCoreDevice *device;
extern CloudIoTCoreMqtt *mqtt;
extern MQTTClient *mqttClient;
extern unsigned long iss;
extern String jwt;
String getJwt();
void publishTelemetry(String data);
void publishTelemetry(const char* data, int length);
void publishTelemetry(String subfolder, String data);
void publishTelemetry(String subfolder, const char* data, int length);
void messageReceived(String &topic, String &payload);

void IOTsetup(void (*setusers)(int));
void IOTloop();
void IOTsend(int *shadows);
void IOTsetUsers(String &payload);
void IOTonConnect();

#endif