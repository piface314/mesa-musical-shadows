import React, { Component } from 'react'
import { SafeAreaView, Text, StatusBar } from 'react-native'
import { styles } from '../theme'

export default class ListenerScreen extends Component {
  static navigationOptions = {
    title: '',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: "white"
  }
  
  render() {
    const input = this.props.navigation.getParam('input', 'None')
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <Text>Listening "{input}"...</Text>
      </SafeAreaView>
    )
  }
}