import React, { Component } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { styles } from '../theme';
import SensorCircle from './sensor-circle';

const SERV_USERS_UUID = "EE0C2928-4910-40A4-AEE0-FCF11A28647F";
// const CHAR_USERS_UUID = "EE0C2929-4910-40A4-AEE0-FCF11A28647F";
const SERV_SLDRX_UUID = "3908F740-3C1C-43C4-8948-4676B382771E";
// const CHAR_SLDRX_UUID = i => `3908F74${i}-3C1C-43C4-8948-4676B382771E`;

export default class ListenerScreen extends Component {
  static navigationOptions = {
    title: '',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: "white"
  };

  state = {
    device: this.props.navigation.getParam('device'),
    charUsers: null,
    charSensors: [],
    connected: false,
  };

  componentDidMount() {
    this.state.device.connect().then(device => {
      this.setState({ ...this.state, connected: true });
      return device.discoverAllServicesAndCharacteristics();
    }).then(device => {
      this.setState({ ...this.state, device: device });
      device.characteristicsForService(SERV_USERS_UUID).then(([char]) => {
        this.setState({ ...this.state, charUsers: char });
      });
      device.characteristicsForService(SERV_SLDRX_UUID).then(chars => {
        this.setState({ ...this.state, charSensors: chars });
      });
    }).catch(error => {
      console.log(error);
    });
  }

  componentWillUnmount() {
    this.state.device.cancelConnection();
  }

  render() {

    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <SensorCircle characteristic={this.state.charSensors[0]} open={true} />
      </SafeAreaView>
    );
  }
}