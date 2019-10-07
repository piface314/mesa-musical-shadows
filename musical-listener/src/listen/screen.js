import React, { Component } from 'react'
import { SafeAreaView, Dimensions, StatusBar, View } from 'react-native'
import { styles, colors } from '../theme'
import SpinningImage from '../spinning'
import SlidingImage from './sliding';

const pulseCircle = require("../../assets/pulse-circle.png")
const wave1 = require("../../assets/wave1.png")
const wave2 = require("../../assets/wave2.png")
const size = Math.round(Dimensions.get('window').width) - 80;

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
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <SpinningImage style={{ height: size, width: size, margin: 25, resizeMode: 'contain' }}
          source={pulseCircle} duration={4000} />
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          borderBottomColor: colors.goldString,
          borderBottomWidth: 3,
        }} />
      </SafeAreaView>
    )
  }
}