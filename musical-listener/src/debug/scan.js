import { styles, colors } from '../theme';
import React, { Component } from 'react';
import { View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import { Icon, ListItem } from 'react-native-elements';
import { FlatList } from 'react-navigation';

const ScannedDevice = (props) => (
  <ListItem
    title={props.device.name}
    subtitle={props.device.id}
    onPress={() => props.navigate('Device', { device: props.device })}
    bottomDivider
    chevron
  />
);

export default class ScanScreen extends Component {
  static navigationOptions = {
    title: 'Conecte-se a um ESP32 Accel',
  };

  state = {
    devices: [],
    scanning: false
  };

  manager = new BleManager();

  componentDidMount() {
    this.scan(2000);
  }

  async requestBT() {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;
      const granted = await PermissionsAndroid.request(permission);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return err;
    }
  }

  scan(timeout) {
    this.requestBT().then(granted => {
      if (granted) {
        const devicesMap = {};
        const subscription = this.manager.onStateChange(state => {
          if (state !== 'PoweredOn') return;
          subscription.remove();
          this.setState({ devices: [], scanning: true });
          this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) return;
            const devices = [];
            devicesMap[device.id] = device;
            for (let id in devicesMap)
              devices.push(devicesMap[id]);
            this.setState({ devices: devices, scanning: true });
          });
          setTimeout(() => this.stopScan(), timeout);
        }, true);
      }
    }).catch(e => console.warn(e));
  }

  stopScan() {
    this.manager.stopDeviceScan();
    this.setState({ ...this.state, scanning: false });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.devices}
          renderItem={({ item }) => (<ScannedDevice device={item} navigate={navigate} />)}
        />
        {this.state.scanning ?
          <FloatingAction
            color={colors.rosepulse} overlayColor="rgba(0,0,0,0)"
            onPressMain={() => this.stopScan()}
            floatingIcon={<Icon color="white" name="stop" />}
          />
          :
          <FloatingAction
            color={colors.bluesoft} overlayColor="rgba(0,0,0,0)"
            onPressMain={() => this.scan(2000)}
            floatingIcon={<Icon color="white" name="bluetooth-searching" />}
          />}
      </View>
    );
  }
}