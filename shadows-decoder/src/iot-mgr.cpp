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
  IOTsetInfo(payload);
}

////////

string *shd_config = NULL;

void IOTsetup(string *config) {
  shd_config = config;
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
  mqttClient->setOptions(180, true, 1000);
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

void IOTsend(shadow_t *shadows) {
  stringstream s;
  s << *shd_config << "," << shadows[0];
  for (int i = 1; i < NSENSORS; i++)
    s << " " << shadows[i];
  string t = s.str();
  publishTelemetry(t.c_str(), t.length());
}

void IOTsetInfo(String &payload) {
  shd_config->assign(payload.c_str());
}
