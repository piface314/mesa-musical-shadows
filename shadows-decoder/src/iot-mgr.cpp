#include "iot-mgr.h"

////////

Client *netClient = NULL;
CloudIoTCoreDevice *device = NULL;
CloudIoTCoreMqtt *mqtt = NULL;
MQTTClient *mqttClient = NULL;
unsigned long iss = 0;
String jwt;

String getJwt() {
  iss = time(nullptr);
  Serial.println("Refreshing JWT");
  jwt = device->createJWT(iss, JWT_EXP_SECS);
  return jwt;
}

void publishTelemetry(String data) {
  mqtt->publishTelemetry(data);
}

void publishTelemetry(const char* data, int length) {
  mqtt->publishTelemetry(data, length);
}

void publishTelemetry(String subfolder, String data) {
  mqtt->publishTelemetry(subfolder, data);
}

void publishTelemetry(String subfolder, const char* data, int length) {
  mqtt->publishTelemetry(subfolder, data, length);
}

void messageReceived(String &topic, String &payload) {
  Serial.println("From Cloud: " + topic + " - " + payload);
  IOTsetUsers(payload);
}

////////

void (*_setUsers)(int) = NULL;

void IOTsetup(void (*setusers)(int)) {
  _setUsers = setusers;
  device = new CloudIoTCoreDevice(PROJECTID, LOCATION, REGISTRYID, DEVICEID, PRIVATE_KEY);
  Serial.println("Setup IoT!");
}

void IOTconfigure() {
  configTime(0, 0, NTP1, NTP2);
  Serial.println("Waiting on time sync...");
  while (time(nullptr) < 1510644967) {
    delay(10);
  }
  netClient = new WiFiClientSecure();
  mqttClient = new MQTTClient(512);
  mqttClient->setOptions(180, true, 1000); // keepAlive, cleanSession, timeout/
  mqtt = new CloudIoTCoreMqtt(mqttClient, netClient, device);
  mqtt->setUseLts(true);
  mqtt->startMQTT();
  Serial.println("Configured IoT!");
}

void IOTloop(bool connectedWiFi) {
  static unsigned long tprev = 0;
  unsigned long t = millis();
  if (t - tprev > 1000 && netClient == NULL) {
    tprev = t;
    if (connectedWiFi)
      IOTconfigure();
  }
  if (mqttClient != NULL) {
    mqttClient->loop();
    delay(50);
    if (!mqttClient->connected())
      mqtt->mqttConnect();
  }
}

void IOTsend(int *shadows) {
  static char buffer[27];
  String t = "[";
  const int lim = NSENSORS * NSETS;
  for (int i = 0; i < lim; i += NSETS) {
    if (i) t += ",";
    sprintf(buffer, "\"%d,%d,%d,%d,%d\"",
      shadows[i], shadows[i + 1],
      shadows[i + 2], shadows[i + 3], shadows[i + 4]);
    t += buffer;
  }
  t += "]";
  publishTelemetry(t);
}

void IOTsetUsers(String &payload) {
  if (_setUsers != NULL)
    _setUsers(payload.toInt());
}
