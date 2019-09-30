import React, { Component } from 'react'
import { View, Text } from 'react-native'

const transform = value => ((value || "").match(/..../g) || []).map(v => (+v / 1000.0).toFixed(3))

export default class SensorLog extends Component {
  render() {
    const { signal, value } = this.props
    return (
      <View style={{
        backgroundColor: "#0000007f",
        flex: 1,
        alignItems: 'center',
        padding: 10,
      }}>
        <Text style={{ color: 'white' }}>
          Sinal: {signal}
        </Text>
        <Text style={{ color: 'white' }}>
          Valor: [{transform(value).toString()}]
        </Text>
      </View>
    )
  }
}