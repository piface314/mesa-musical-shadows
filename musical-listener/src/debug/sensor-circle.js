import React, { Component } from 'react'
import { View } from 'react-native'
import { colors } from '../theme'

export default class SensorCircle extends Component {
  static size = 42

  floatToHex(float) {
    return ("0" + (Math.floor(255 * float).toString(16))).slice(-2)
  }

  render() {
    const { open, reading } = this.props
    return (
      <View style={{
        width: SensorCircle.size,
        height: SensorCircle.size,
        borderRadius: SensorCircle.size / 2,
        borderWidth: 3,
        borderColor: open ? colors.rosePulse : "black",
        backgroundColor: colors.goldString + this.floatToHex(reading),
      }} />
    )
  }
}
