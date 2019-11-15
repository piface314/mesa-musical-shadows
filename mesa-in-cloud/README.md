# Mesa In Cloud

Nesta pasta se encontra o código-fonte das funções que devem ser registradas no Google Cloud Functions para gerenciar a quantidade de usuários conectados e a atualização dos valores enviados pelo ESP32.

**Serviços do Google Cloud usados:**
- IoT Core
- Pub/Sub
- Functions
- Firebase

Seguem os passos realizados para configurar cada serviço.

## Configurando IoT Core

1. Criar um registro chamado `shadows-decoder`:
```
$ gcloud iot registries create shadows-decoder --event-notification-config=topic=mesa-in-cloud --region=europe-west1
```
2. Criar um dispositivo nesse registro chamado `shadows-decoder-device`:
```
$ gcloud iot devices create shadows-decoder-device --region=europe-west1 --registry=shadows-decoder --public-key=path=./shadows-decoder-ec-public.pem,type=es256
```

## Configurando Pub/Sub

1. Criar um tópico chamado `mesa-in-cloud`:
```
$ gcloud pubsub topics create mesa-in-cloud
```

## Configurando Functions

Para todas as funções, os arquivos `index.js` e `package.json` correspondem aos arquivos nesta pasta da respectiva função.

1. Criar uma função chamada ``:
  - Acionador/Trigger:
  - Tipo de evento: ``
  - Documento: ``
  - Runtime: Node.js 8
  - Função a ser executada: ``

## Configurando Firebase
//
