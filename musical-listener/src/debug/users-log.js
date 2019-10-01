import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Base64 } from 'js-base64'

export default class UsersLog extends Component {
  render() {
    const { characteristic, style } = this.props
    if (!characteristic)
      return (<View style={style} />)
    const value = Base64.decode(characteristic.value).charCodeAt(0)
    return (
      <View style={[{
        backgroundColor: "#0000007f",
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
      }, style]}>
        <Text style={{ color: 'white' }}>
          #Usuários conectados: {value}
        </Text>
      </View>
    )
  }
}