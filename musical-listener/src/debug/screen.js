import React, { Component } from 'react'
import { SafeAreaView, StatusBar, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { styles } from '../theme'
import SensorPanel from './sensor-panel'
import SensorLog from './sensor-log'
import UsersLog from './users-log'
import Loading from '../loading'
import Player from '../listen/player'
import { Base64 } from 'js-base64'

const SERV_WIFIC_UUID = "A6B4E0B4-F610-4C51-903A-8425EEF6FD91"
const SERV_USERS_UUID = "EE0C2928-4910-40A4-AEE0-FCF11A28647F"
const SERV_SLDRX_UUID = "3908F740-3C1C-43C4-8948-4676B382771E"

export default class DebugScreen extends Component {
  static navigationOptions = {
    title: '',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: "white"
  }

  state = {
    device: this.props.navigation.getParam('device'),
    charUsers: null,
    connected: false,
    openSensor: null,
    error: null,
  }

  charsWiFi = []
  monitorUser = null
  monitorSensors = []

  componentDidMount() {
    Player.setVolume(Array(Player.sounds.length).fill(0))
    Player.play()

    // Conecta ao dispositivo
    this.state.device.connect().then(device => {
      this.setState({ ...this.state, connected: true })
      return device.discoverAllServicesAndCharacteristics()
    }).then(device => {
      // Atualiza com os serviços e características descobertos
      this.setState({ ...this.state, device: device })

      // Armazena as características de configuração do WiFi
      device.characteristicsForService(SERV_WIFIC_UUID).then(chars => {
        chars.sort((a, b) => a.uuid < b.uuid ? -1 : 1)
        this.charsWiFi = chars
      }).catch(() => this.setState({ ...this.state, error: "Este dispositivo não é uma Mesa." }))

      // Monitora a característica de quantidade de usuários
      device.characteristicsForService(SERV_USERS_UUID).then(([char]) => {
        this.monitorUser = char.monitor((err, c) => {
          if (err) return
          this.setState({ ...this.state, charUsers: c })
        })
      }).catch(() => this.setState({ ...this.state, error: "Este dispositivo não é uma Mesa." }))

      // Monitora as características dos sensores
      device.characteristicsForService(SERV_SLDRX_UUID).then(chars => {
        chars.forEach((c, i) => {
          this.monitorSensors[i] = c.monitor((err, c) => {
            this.setState({ ...this.state, ["charSensors" + i]: err ? null : c })
          })
        })
      }).catch(() => this.setState({ ...this.state, error: "Este dispositivo não é uma Mesa." }))
    }).catch(() => this.setState({ ...this.state, error: "Não foi possível conectar." }))
  }

  componentWillUnmount() {
    if (this.monitorUser) this.monitorUser.remove()
    this.monitorSensors.forEach(m => m.remove())
    this.state.device.cancelConnection()
    Player.stop()
  }

  openSensor(i) {
    const { openSensor } = this.state
    this.setState({ ...this.state, openSensor: i === openSensor ? null : i })
  }

  toWifiScreen() {
    const [charSSID, charPSWD] = this.charsWiFi
    this.props.navigation.navigate('Wifi', { charSSID, charPSWD })
  }

  setVolume(chars) {
    const vol = chars.map(c => (+Base64.decode(c.value).slice(0, 4)) / 1000.0)
    if (vol.length == 7)
      Player.setVolume(vol)
  }

  render() {
    const { openSensor, charUsers, error } = this.state
    const { navigation } = this.props
    if (error)
      return (
        <SafeAreaView style={styles.centerContainer}>
          <Text>{error}</Text>
          <Text style={{ fontSize: 32, marginTop: 20 }}>:(</Text>
        </SafeAreaView>
      )
    const charSensors = []
    for (let i = 0; this.state["charSensors" + i]; i++)
      charSensors[i] = this.state["charSensors" + i]
    this.setVolume(charSensors)

    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <SensorLog style={{
          position: 'absolute',
          top: 20,
          left: 20,
          right: 20
        }} characteristic={openSensor >= 0 && charSensors[openSensor]} />
        <SensorPanel chars={charSensors} open={openSensor} onPress={(i) => this.openSensor(i)} />
        <View style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          justifyContent: 'space-between',
        }}>
          <UsersLog characteristic={charUsers} />
          <Button title="CONFIGURAR WI-FI" raised
            buttonStyle={styles.button} containerStyle={{ marginTop: 10 }}
            onPress={() => this.toWifiScreen()} />
        </View>
        <Loading show={!charUsers || charSensors.length == 0} cancel={() => navigation.goBack()} />
      </SafeAreaView>
    )
  }
}