import React, { Component } from 'react';
import { Text, StatusBar, SafeAreaView, Image } from 'react-native';
import { styles } from '../theme';

export default class ConnectScreen extends Component {
  static navigationOptions = {
    title: 'Mesa Musical Shadows',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: "white"
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <Image source={require("../../assets/logo.png")} style={{height:200, width:200}} />
      </SafeAreaView>
    );
  }
}