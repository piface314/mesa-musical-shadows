import { styles, colors } from '../theme'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import { PermissionsAndroid } from 'react-native'
import { Icon, ListItem, Button } from 'react-native-elements'
import { FlatList } from 'react-navigation'

const ScannedDevice = ({ device, navigate }) => (
  <ListItem
    title={device.name}
    subtitle={device.id}
    onPress={() => navigate('Debug', { device: device })}
    bottomDivider
    chevron
  />
)

const fabSize = 60
const fabMargin = 30
const FAButton = ({ color, onPress, icon }) => (
  <Button
    raised
    onPress={onPress}
    containerStyle={{
      position: 'absolute',
      bottom: fabMargin,
      right: fabMargin,
      width: fabSize,
      height: fabSize,
      borderRadius: fabSize / 2,
    }}
    buttonStyle={{
      backgroundColor: color,
      width: fabSize,
      height: fabSize,
      borderRadius: fabSize / 2,
    }}
    icon={icon}
  />
)

export default class ScanScreen extends Component {
  static navigationOptions = {
    title: 'Conecte-se a uma Mesa',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: "white"
  }

  state = {
    devices: [],
    scanning: false
  }

  manager = new BleManager()

  componentDidMount() {
    this.scan(2000)
  }

  componentWillUnmount() {
    this.stopScan()
  }

  async requestBT() {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      const granted = await PermissionsAndroid.request(permission)
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (err) {
      return err
    }
  }

  scan(timeout) {
    this.requestBT().then(granted => {
      if (granted) {
        const devicesMap = {}
        const subscription = this.manager.onStateChange(state => {
          if (state !== 'PoweredOn') return
          subscription.remove()
          this.setState({ devices: [], scanning: true })
          this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) return
            const devices = []
            devicesMap[device.id] = device
            for (let id in devicesMap)
              devices.push(devicesMap[id])
            this.setState({ devices: devices, scanning: true })
          })
          setTimeout(() => this.stopScan(), timeout)
        }, true)
      }
    }).catch(e => console.warn(e))
  }

  stopScan() {
    this.manager.stopDeviceScan()
    this.setState({ ...this.state, scanning: false })
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.devices}
          renderItem={({ item }) => (<ScannedDevice device={item} navigate={navigate} />)}
        />
        {
          this.state.scanning ?
            <FAButton color={colors.rosePulse} onPress={() => this.stopScan()}
              icon={<Icon color="white" name="stop" size={28} />} />
            :
            <FAButton color={colors.blueSoft} onPress={() => this.scan(2000)}
              icon={<Icon color="white" name="bluetooth-searching" size={28} />} />
        }
      </SafeAreaView>
    )
  }
}