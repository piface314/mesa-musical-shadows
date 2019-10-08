import React, { Component } from 'react'
import { SafeAreaView, Dimensions, StatusBar, View } from 'react-native'
import { styles, colors } from '../theme'
import SpinningImage from '../spinning'
import SlidingImage from './sliding'
import Player from './player'

const pulseCircle = require("../../assets/pulse-circle.png")
const wave1 = require("../../assets/wave1.png")
const wave2 = require("../../assets/wave2.png")
const size = Math.round(Dimensions.get('window').width) - 80;

const signals = [
  [0.665, 0.462, 0.851, 0.176, 0.263, 0.395, 0.488],
  [0.078, 0.369, 0.786, 0.297, 0.974, 0.616, 0.975],
  [0.162, 0.989, 0.700, 0.116, 0.926, 0.039, 0.379],
  [0.014, 0.087, 0.343, 0.372, 0.993, 0.167, 0.893],
  [0.331, 0.954, 0.140, 0.496, 0.416, 0.992, 0.471],
  [0.679, 0.387, 0.960, 0.357, 0.756, 0.746, 0.354],
  [0.730, 0.361, 0.329, 0.293, 0.349, 0.028, 0.409],
  [0.275, 0.968, 0.789, 0.289, 0.156, 0.131, 0.662],
  [0.149, 0.299, 0.555, 0.180, 0.252, 0.696, 0.476],
  [0.668, 0.687, 0.948, 0.047, 0.073, 0.907, 0.104],
  [0.830, 0.652, 0.459, 0.060, 0.013, 0.788, 0.452],
  [0.363, 0.817, 0.862, 0.138, 0.886, 0.650, 0.928],
]

export default class ListenerScreen extends Component {
  static navigationOptions = {
    title: '',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: "white"
  }

  sigi = 0
  sigrot = setInterval(() => {
    Player.setVolume(signals[this.sigi])
    this.sigi = (this.sigi + 1) % signals.length
  }, 1000);

  componentDidMount() {
    setTimeout(() => Player.play(), 100)
  }

  componentWillUnmount() {
    clearInterval(this.sigrot)
    Player.stop()
  }

  render() {
    const input = this.props.navigation.getParam('input', 'None')
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <SlidingImage source={wave1} duration={6000} />
        <SpinningImage style={{
          position: 'absolute', height: size, width: size,
          margin: 25, resizeMode: 'contain'
        }}
          source={pulseCircle} duration={4000} />
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          borderBottomColor: colors.goldString,
          borderBottomWidth: 3,
        }} />
        <SlidingImage source={wave2} duration={4000} />
      </SafeAreaView>
    )
  }
}