#include "shadows-ble.h"
#include "shadows-wifi.h"

BLECharacteristic *pCharUsers, *pCharSensors[7];
bool connectedBLE = false;

class ServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) { connectedBLE = true; }
  void onDisconnect(BLEServer *pServer) { connectedBLE = false; }
};

class WifiCallbacks: public BLECharacteristicCallbacks {
  private:
  char *buffer;
  public:
  WifiCallbacks(char *dest) : buffer(dest) { }
  void onWrite(BLECharacteristic *pChar) {
    string value = pChar->getValue();
    int i;
    for (i = 0; value[i] && i < 20; i++)
      buffer[i] = value[i];
    buffer[i] = '\0';
  }
};

void BLEsetup() {
  char sldrUUIDs[7][37] = { CHAR_SLDRX_UUID };
  // Configura o ESP32
  BLEDevice::init("ESP32 Mesa Musical Shadows");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  // Configura o serviço de configurar wifi
  BLEService *pWifiService = pServer->createService(SERV_WIFIC_UUID);
  BLECharacteristic *pChWifiSSID = pWifiService->createCharacteristic(CHAR_WSSID_UUID, BLECharacteristic::PROPERTY_WRITE);
  pChWifiSSID->setCallbacks(new WifiCallbacks(wifiSSID));
  BLECharacteristic *pChWifiPSWD = pWifiService->createCharacteristic(CHAR_WPSWD_UUID, BLECharacteristic::PROPERTY_WRITE);
  pChWifiPSWD->setCallbacks(new WifiCallbacks(wifiPSWD));
  pWifiService->start();

  // Configura o serviço de #usuários
  BLEService *pUserService = pServer->createService(SERV_USERS_UUID);
  pCharUsers = pUserService->createCharacteristic(CHAR_USERS_UUID, BLECharacteristic::PROPERTY_NOTIFY);
  pCharUsers->addDescriptor(new BLE2902());
  pUserService->start();
  
  //Configura o serviço da música
  BLEService *pMusicService = pServer->createService(BLEUUID(SERV_SLDRX_UUID), 35, (uint8_t)'\000');
  for (int i = 0; i < 7; ++i) {
    pCharSensors[i] = pMusicService->createCharacteristic(sldrUUIDs[i], BLECharacteristic::PROPERTY_NOTIFY);
    pCharSensors[i]->addDescriptor(new BLE2902());
  }
  pMusicService->start();
  pServer->getAdvertising()->start();
}

void BLEloop() {
  if (connectedBLE) {
    char val[21];
    uint8_t *pval = (uint8_t *)val;
    for (int i = 0; i < 7; ++i) {
      sprintf(val, "%04d%04d%04d%04d%04d",
        rand() % 1001,
        rand() % 801,
        rand() % 601,
        rand() % 401,
        rand() % 201);
      pCharSensors[i]->setValue(pval, 20);
      pCharSensors[i]->notify();
    }
    uint8_t u = rand() % 6;
    pCharUsers->setValue(&u, 1);
    pCharUsers->notify();
  }
}