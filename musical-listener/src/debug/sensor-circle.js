import React, { Component } from 'react'
import { View } from 'react-native'
import { Base64 } from 'js-base64'
import { colors } from '../theme'

export default class SensorCircle extends Component {
  static size = 42

  getSignal() {
    const { characteristic } = this.props
    const value = Base64.decode(characteristic.value).slice(0, 4)
    return (+value) / 1000.0
  }

  floatToHex(float) {
    return Math.floor(255 * float).toString(16)
  }

  render() {
    const { open } = this.props
    return (
      <View style={{
        width: SensorCircle.size,
        height: SensorCircle.size,
        borderRadius: SensorCircle.size / 2,
        borderWidth: 3,
        borderColor: open ? colors.rosePulse : "black",
        backgroundColor: colors.goldString + this.floatToHex(this.getSignal()),
      }} />
    )
  }
}