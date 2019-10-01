import React, { Component } from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'
import { styles } from '../theme'
import SensorPanel from './sensor-panel'
import SensorLog from './sensor-log';
import UsersLog from './users-log';

const SERV_USERS_UUID = "EE0C2928-4910-40A4-AEE0-FCF11A28647F"
// const CHAR_USERS_UUID = "EE0C2929-4910-40A4-AEE0-FCF11A28647F"
const SERV_SLDRX_UUID = "3908F740-3C1C-43C4-8948-4676B382771E"
// const CHAR_SLDRX_UUID = i => `3908F74${i}-3C1C-43C4-8948-4676B382771E`

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
    open: null,
  }

  monitorUser = null
  monitorSensors = []

  componentDidMount() {
    this.state.device.connect().then(device => {
      this.setState({ ...this.state, connected: true })
      return device.discoverAllServicesAndCharacteristics()
    }).then(device => {
      this.setState({ ...this.state, device: device })
      device.characteristicsForService(SERV_USERS_UUID).then(([char]) => {
        this.monitorUser = char.monitor((err, c) => {
          if (err) return
          this.setState({ ...this.state, charUsers: c })
        })
      })
      device.characteristicsForService(SERV_SLDRX_UUID).then(chars => {
        chars.forEach((c, i) => {
          this.monitorSensors[i] = c.monitor((err, c) => {
            this.setState({ ...this.state, ["charSensors" + i]: err ? null : c })
          })
        })
      })
    }).catch(error => {
      console.log(error)
    })
  }

  componentWillUnmount() {
    if (this.monitorUser) this.monitorUser.remove()
    this.monitorSensors.forEach(m => m.remove())
    this.state.device.cancelConnection()
  }

  openSensor(i) {
    const { open } = this.state
    this.setState({ ...this.state, open: i === open ? null : i })
  }

  render() {
    const { open } = this.state
    const charSensors = []
    for (let i = 0; this.state["charSensors" + i]; i++)
      charSensors[i] = this.state["charSensors" + i]
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <SensorLog style={{
          position: 'absolute',
          top: 20,
          left: 20,
          right: 20
        }} characteristic={open >= 0 && charSensors[open]} />
        <SensorPanel style={{  }}
          chars={charSensors} open={open} onPress={(i) => this.openSensor(i)} />
        <UsersLog style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20
        }} characteristic={this.state.charUsers} />
      </SafeAreaView>
    )
  }
}