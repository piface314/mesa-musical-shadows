import React, { Component } from 'react';
import { StatusBar, SafeAreaView, Image, ScrollView, View } from 'react-native';
import { styles } from '../theme';
import { Input, Button } from 'react-native-elements';
import SpinningImage from './spinning';

const logo = require("../../assets/logo.png");

export default class ConnectScreen extends Component {
  static navigationOptions = {
    title: 'Mesa Musical Shadows',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: "white"
  };

  state = { input: "" };

  toConnectScreen() {
    
  }

  toDebugScreen() {

  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <ScrollView>
          <SpinningImage style={{ height: 200, width: null, margin: 25, resizeMode: 'contain' }}
            source={logo} duration={16000} />
          <Input
            value={this.state.input}
            onChangeText={input => this.setState({ input })}
            label="ID" labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputContainer}
          />
          <Button title="CONECTAR" raised containerStyle={styles.buttonContainer}
            buttonStyle={styles.button} onPress={() => this.toConnectScreen()} />
          <Button title="DEBUG" raised containerStyle={styles.buttonContainer}
            buttonStyle={styles.button} onPress={() => this.toDebugScreen()} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}