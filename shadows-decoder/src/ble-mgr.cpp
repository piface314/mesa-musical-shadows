#include "ble-mgr.h"

const char SERV_WIFIC_UUID[] = "A6B4E0B4-F610-4C51-903A-8425EEF6FD91";
const char CHAR_WSSID_UUID[] = "A6B4E0B5-F610-4C51-903A-8425EEF6FD91";
const char CHAR_WPSWD_UUID[] = "A6B4E0B6-F610-4C51-903A-8425EEF6FD91";
const char SERV_USERS_UUID[] = "EE0C2928-4910-40A4-AEE0-FCF11A28647F";
const char CHAR_USERS_UUID[] = "EE0C2929-4910-40A4-AEE0-FCF11A28647F";
const char SERV_SLDRX_UUID[] = "3908F740-3C1C-43C4-8948-4676B382771E";
const char CHAR_SLDRX_UUID[NSENSORS][37] = {
  "3908F741-3C1C-43C4-8948-4676B382771E",
  "3908F742-3C1C-43C4-8948-4676B382771E",
  "3908F743-3C1C-43C4-8948-4676B382771E",
  "3908F744-3C1C-43C4-8948-4676B382771E",
  "3908F745-3C1C-43C4-8948-4676B382771E",
  "3908F746-3C1C-43C4-8948-4676B382771E",
  "3908F747-3C1C-43C4-8948-4676B382771E"
};

BLECharacteristic *_charUsers = NULL;
BLECharacteristic *_charSensors[NSENSORS];
bool _connected = false;

class ServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer *pServer) { _connected = true; }
  void onDisconnect(BLEServer *pServer) { _connected = false; }
};

class WifiCallbacks: public BLECharacteristicCallbacks {
  private: int sel; public:
  WifiCallbacks(int s) : sel(s) { }
  void onWrite(BLECharacteristic *pChar) {
    onWriteCred(pChar->getValue(), sel);
  }
};

void BLEsetup() {
  if (_charUsers != NULL) return;
  // Configura o ESP32
  BLEDevice::init("ESP32 Mesa Musical Shadows");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  // Configura o serviço de configurar wifi
  BLEService *pWifiService = pServer->createService(SERV_WIFIC_UUID);
  BLECharacteristic *pChWifiSSID = pWifiService->createCharacteristic(CHAR_WSSID_UUID, BLECharacteristic::PROPERTY_WRITE);
  pChWifiSSID->setCallbacks(new WifiCallbacks(0));
  BLECharacteristic *pChWifiPSWD = pWifiService->createCharacteristic(CHAR_WPSWD_UUID, BLECharacteristic::PROPERTY_WRITE);
  pChWifiPSWD->setCallbacks(new WifiCallbacks(1));
  pWifiService->start();

  // Configura o serviço de #usuários
  BLEService *pUserService = pServer->createService(SERV_USERS_UUID);
  _charUsers = pUserService->createCharacteristic(CHAR_USERS_UUID, BLECharacteristic::PROPERTY_NOTIFY);
  _charUsers->addDescriptor(new BLE2902());
  pUserService->start();
  
  //Configura o serviço da música
  BLEService *pMusicService = pServer->createService(BLEUUID(SERV_SLDRX_UUID), 35, (uint8_t)'\000');
  for (int i = 0; i < NSENSORS; ++i) {
    _charSensors[i] = pMusicService->createCharacteristic(CHAR_SLDRX_UUID[i], BLECharacteristic::PROPERTY_NOTIFY);
    _charSensors[i]->addDescriptor(new BLE2902());
  }
  pMusicService->start();
  pServer->getAdvertising()->start();
  Serial.println("Setup BLE!");
}

void BLEsend(int users, int *shadows) {
  if (_connected) {
    char val[DATA_SIZE];
    uint8_t *pval = (uint8_t *)val;
    for (int i = 0; i < NSENSORS; ++i) {
      int ii = NSETS * i;
      sprintf(val, "%04d%04d%04d%04d%04d",
        shadows[ii], shadows[ii + 1],
        shadows[ii + 2], shadows[ii + 3], shadows[ii + 4]);
      _charSensors[i]->setValue(pval, 20);
      _charSensors[i]->notify();
    }
    uint8_t u = users;
    _charUsers->setValue(&u, 1);
    _charUsers->notify();
  }
}

void onWriteCred(string data, int sel) {
  static bool dirty[2] = { false, false };
  static char buffers[2][DATA_SIZE];
  static const int lim = DATA_SIZE - 1;
  char c;
  int i;
  for (i = 0; (c = data[i]) && i < lim; i++)
    buffers[sel][i] = c;
  buffers[sel][i] = '\0';
  dirty[sel] = true;
  if (dirty[0] && dirty[1]) {
    dirty[0] = false; dirty[1] = false;
    WIFIsetCredentials(buffers[0], buffers[1]);
  }
}