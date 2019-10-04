import React, { Component } from 'react'
import { Animated, Easing } from 'react-native'

export default class SlidingImage extends Component {
  state = { slideVale: new Animated.Value(0) }

  componentDidMount() {
    Animated.loop(
      Animated.timing(
        this.state.slideVale,
        {
          toValue: this.props.toValue || 1,
          duration: this.props.duration || 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }
      )
    ).start()
  }

  render() {
    const { source, style } = this.props
    let spin = this.state.slideVale.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    return (
      <Animated.Image style={{ ...style, transform: [{ rotate: spin }], }} source={source} />
    )
  }
}