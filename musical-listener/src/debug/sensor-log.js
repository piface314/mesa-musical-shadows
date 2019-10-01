import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Base64 } from 'js-base64'
import { colors } from '../theme'

const transform = value => ((value || "").match(/..../g) || []).map(v => (+v / 1000.0).toFixed(3))

export default class SensorLog extends Component {
  render() {
    const { characteristic, style } = this.props
    if (!characteristic)
      return (<View style={style} />)
    const values = transform(Base64.decode(characteristic.value))
    const signal = values[0]
    return (
      <View style={[{
        backgroundColor: colors.rosePulse,
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
      }, style]}>
        <Text style={{ color: 'white' }}>
          Sinal: {signal}
        </Text>
        <Text style={{ color: 'white' }}>
          Valores: [{values.reduce((prev, s) => prev + ", " + s)}]
        </Text>
      </View>
    )
  }
}