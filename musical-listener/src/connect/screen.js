import React, { Component } from 'react';

export default class ConnectScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const device = navigation.getParam('device');
    return {
      title: device.name || device.id,
    };
  };
  render() {

  }
}