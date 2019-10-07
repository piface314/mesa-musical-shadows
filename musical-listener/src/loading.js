import React, { Component } from 'react'
import { View } from 'react-native'
import { Overlay } from 'react-native-elements'
import SpinningImage from './spinning'
import { styles } from './theme'

const logoLine = require("../assets/logo-line.png")
const size = 200

export default class Loading extends Component {
  render() {
    const { show, cancel } = this.props
    if (!show)
      return null
    return (
      <Overlay
        isVisible={show}
        fullScreen={true}
        windowBackgroundColor="transparent"
        overlayBackgroundColor="rgba(255,255,255,.5)"
        onBackdropPress={cancel}
      >
        <View style={styles.centerContainer}>
          <SpinningImage style={{ height: size, width: size, resizeMode: 'contain' }}
            source={logoLine} duration={2000} />
        </View>
      </Overlay>
    )
  }
}