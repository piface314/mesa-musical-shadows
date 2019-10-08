import React, { Component } from 'react'
import { SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements'
import { styles } from '../theme'
import { Base64 } from 'js-base64'

export default class WifiSettingsScreen extends Component {
  static navigationOptions = {
    title: 'Configurar Wi-Fi',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: "white"
  }

  state = {
    ssid: "",
    pswd: ""
  }

  set(ssid, pswd) {
    const { getParam } = this.props.navigation
    const charSSID = getParam('charSSID')
    const charPSWD = getParam('charPSWD')
    charSSID.writeWithoutResponse(Base64.encode(ssid))
    charPSWD.writeWithoutResponse(Base64.encode(pswd))
  }

  render() {
    const { ssid, pswd } = this.state
    return (
      <SafeAreaView style={[styles.container, {paddingTop: 30}]}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <ScrollView>
          <Input
            value={ssid}
            onChangeText={ssid => this.setState({ ssid, pswd })}
            label="SSID" labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputContainer}
          />
          <Input
            value={pswd}
            onChangeText={pswd => this.setState({ ssid, pswd })}
            label="Senha" labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputContainer}
          />
          <Button title="CONFIGURAR" raised containerStyle={styles.buttonContainer}
            buttonStyle={styles.button} onPress={() => this.set(ssid, pswd)} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}