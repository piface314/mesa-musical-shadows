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

1. Criar uma função chamada `adjust-user-count`:
  - Acionador/Trigger: Cloud Firestore (Beta)
  - Tipo de evento: `write`
  - Documento: `users/{docID}`
  - Runtime: Node.js 8
  - Função a ser executada: `adjustUserCount`
2. Criar uma função chamada `set-user-count`:
  - Acionador/Trigger: Cloud Firestore (Beta)
  - Tipo de evento: `update`
  - Documento: `counters/users`
  - Runtime: Node.js 8
  - Função a ser executada: `setUserCount`
3. Criar uma função chamada `update-shadows`:
  - Acionador/Trigger: Cloud Pub/Sub
  - Tópico: `mesa-in-cloud`
  - Runtime: Node.js 8
  - Função a ser executada: `updateShadows`

## Configurando Firebase
1. Criar a coleção `counters`, com o documento inicial `users`, com apenas um campo, `count`, do tipo `number`, com valor `0`.
2. Criar a coleção `shadows`, com o documento inicial `values`, com apenas um campo, `sensors`, do tipo `array`, com 7 entradas, todas do tipo `string`, com valor inicial qualquer em cada.
3. Criar a coleção `users`, com um documento inicial de nome qualquer, com qualquer campo ou valor inicial. Esse documento serve apenas para manter a coleção aberta. Os demais documentos, futuramente adicionados quando um usuário se conecta, é que são contados.
4. Se o valor do campo `count`, do documento `counters/users` tiver sido alterado, volte-o manualmente para `0`. Depois disso, a função `adjust-user-count` vai ser responsável por gerenciar essa contagem.
