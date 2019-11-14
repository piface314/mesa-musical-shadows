import React, { Component } from 'react'
import { StatusBar, SafeAreaView, ScrollView } from 'react-native'
import { styles } from '../theme'
import { Input, Button } from 'react-native-elements'
import SpinningImage from '../spinning'

const logo = require("../../assets/logo.png")

export default class ConnectScreen extends Component {
  static navigationOptions = {
    title: 'Mesa Musical Shadows',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: "white"
  }

  state = { inputID: "", inputUser: "" }

  toConnectScreen() {
    const { inputID, inputUser } = this.state
    this.props.navigation.navigate('Listener', { deviceID: inputID, user: inputUser })
  }

  toDebugScreen() {
    this.props.navigation.navigate('Scan')
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <ScrollView>
          <SpinningImage style={{ height: 200, width: null, margin: 25, resizeMode: 'contain' }}
            source={logo} duration={16000} />
          <Input
            value={this.state.inputID}
            onChangeText={input => this.setState({ ...this.state, inputID: input })}
            label="ID da Mesa" labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputContainer}
          />
          <Input
            value={this.state.inputUser}
            onChangeText={input => this.setState({ ...this.state, inputUser: input })}
            label="Nome de usuário" labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputContainer}
          />
          <Button title="CONECTAR" raised containerStyle={styles.buttonContainer}
            buttonStyle={styles.button} onPress={() => this.toConnectScreen()} />
          <Button title="DEBUG & CONFIGURAR" raised containerStyle={styles.buttonContainer}
            buttonStyle={styles.button} onPress={() => this.toDebugScreen()} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}