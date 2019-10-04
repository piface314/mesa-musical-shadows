import React, { Component } from 'react'
import { View } from 'react-native'
import SpinningImage from './spinning'

const logoLine = require("../assets/logo-line.png")
const size = 200

export default class Loading extends Component {
  render() {
    const { show } = this.props
    if (!show)
      return null
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffffaf',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <SpinningImage style={{ height: size, width: size, resizeMode: 'contain' }}
          source={logoLine} duration={2000} />
      </View>
    )
  }
}