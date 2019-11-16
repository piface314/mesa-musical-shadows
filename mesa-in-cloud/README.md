# Mesa In Cloud

Nesta pasta se encontra o código-fonte das funções que devem ser registradas no Google Cloud Functions para gerenciar a quantidade de usuários conectados e a atualização dos valores enviados pelo ESP32.

**Serviços do Google Cloud usados:**
- IoT Core
- Pub/Sub
- Firestore
- BigQuery
- Functions

Seguem os passos realizados para configurar cada serviço.

## Configurando IoT Core

1. Criar um registro chamado `shadows-decoder`:

2. Criar dispositivos nesse registro.

## Configurando Pub/Sub

1. Criar um tópico chamado `mesa-in-cloud`:
```bash
$ gcloud pubsub topics create mesa-in-cloud
```

## Configurando Firestore

1. Criar uma coleção `devices`.

2. Inserir nessa coleção um documento para cada dispositivo criado, colocando três campos no documento:
    - `lastcheck` do tipo `timestamp`, em algum momento do passado.
    - `sets` do tipo `array` com elementos do tipo `number`. Esse array pode estar vazio.
    - `usercount` do tipo `number`, com o valor `0`.

## Configurando BigQuery

1. Crie um dataset chamado `mesaincloud`.

2. Crie uma tabela chamada `reading` com as colunas:
    - `device_id` do tipo `STRING`
    - `timestamp` do tipo `TIMESTAMP`
    - [`ri` | `i` = 0, 1, ... n ] do tipo `FLOAT`, sendo n o número de sensores. Ex.: com dois sensores haverá duas colunas, `r0` e `r1`.


## Configurando Functions

Para todas as funções, os arquivos `index.js` e `package.json` correspondem aos arquivos nesta pasta da respectiva função.

1. Criar a função `add-shadow`:
  - Acionador/Trigger: Pub/Sub
  - Tópico: `mesa-in-cloud`
  - Runtime: Node.js 8
  - Função a ser executada: `addShadow`

2. Criar a função `set-device-config`:
  - Acionador/Trigger: Firestore
  - Tipo de evento: `update`
  - Documento: `devices/{deviceID}`
  - Runtime: Node.js 8
  - Função a ser executada: `setDeviceConfig`

3. Criar a função `update-sets`:
  - Acionador/Trigger: Firestore
  - Tipo de evento: `create`
  - Documento: `devices/{deviceID}/shadows/{docID}`
  - Runtime: Node.js 8
  - Função a ser executada: `updateSets`

4. Criar a função `update-user-count`:
  - Acionador/Trigger: Firestore
  - Tipo de evento: `write`
  - Documento: `devices/{deviceID}/users/{docID}`
  - Runtime: Node.js 8
  - Função a ser executada: `updateUserCount`
