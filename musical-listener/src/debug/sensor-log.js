import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { colors } from '../theme'

export default class SensorLog extends Component {
  render() {
    const { reading, style } = this.props
    if (reading == null)
      return (<View style={style} />)
    return (
      <View style={[{
        backgroundColor: colors.rosePulse,
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
      }, style]}>
        <Text style={{ color: 'white' }}>
          Sinal: {reading}
        </Text>
      </View>
    )
  }
}
