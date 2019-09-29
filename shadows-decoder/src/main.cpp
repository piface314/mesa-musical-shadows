#include "Arduino.h"

#include <iostream>
#include <string>

// Bluetooth
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

using namespace std;

#define SERV_USERS_UUID "EE0C2928-4910-40A4-AEE0-FCF11A28647F"
#define CHAR_USERS_UUID "EE0C2929-4910-40A4-AEE0-FCF11A28647F"
#define SERV_SLDRX_UUID "3908F740-3C1C-43C4-8948-4676B382771E"
#define CHAR_SLDRX_UUID "3908F741-3C1C-43C4-8948-4676B382771E", \
                        "3908F742-3C1C-43C4-8948-4676B382771E", \
                        "3908F743-3C1C-43C4-8948-4676B382771E", \
                        "3908F744-3C1C-43C4-8948-4676B382771E", \
                        "3908F745-3C1C-43C4-8948-4676B382771E", \
                        "3908F746-3C1C-43C4-8948-4676B382771E", \
                        "3908F747-3C1C-43C4-8948-4676B382771E"

BLECharacteristic *pCharUsers, *pCharSensors[7];
bool connected = false;

class ServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) { connected = true; }
  void onDisconnect(BLEServer *pServer) { connected = false; }
};

void setup() {
  char sldrUUIDs[7][37] = { CHAR_SLDRX_UUID };
  BLE2902 descriptors[7];
  Serial.begin(9600);
  // Configura o ESP32
  BLEDevice::init("ESP32 Mesa Musical Shadows");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  // Configura o serviço de #usuários
  BLEService *pUserService = pServer->createService(SERV_USERS_UUID);
  pCharUsers = pUserService->createCharacteristic(CHAR_USERS_UUID, BLECharacteristic::PROPERTY_NOTIFY);
  pCharUsers->addDescriptor(new BLE2902());
  pUserService->start();
  
  //Configura o serviço da música
  BLEService *pMusicService = pServer->createService(BLEUUID(SERV_SLDRX_UUID), 35, (uint8_t)'\000');
  for (int i = 0; i < 7; i++) {
    pCharSensors[i] = pMusicService->createCharacteristic(sldrUUIDs[i], BLECharacteristic::PROPERTY_NOTIFY);
    pCharSensors[i]->addDescriptor(descriptors + i);
  }
  pMusicService->start();
  pServer->getAdvertising()->start();
}

void loop() {

}