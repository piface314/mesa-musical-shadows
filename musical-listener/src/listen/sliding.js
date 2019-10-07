import React, { Component } from 'react'
import { Animated, Easing, Dimensions, View } from 'react-native'
import { styles } from '../theme';

export default class SlidingImage extends Component {
  state = { slideValue: new Animated.Value(0), wd: 0 }

  componentDidMount() {
    Animated.loop(
      Animated.timing(
        this.state.slideValue,
        {
          toValue: this.props.toValue || 1,
          duration: this.props.duration || 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }
      )
    ).start()

    Dimensions.addEventListener('change', ({ screen }) => {
      this.setState({ ...this.state, wd: screen.width })
    })
  }

  render() {
    const { source, style } = this.props
    const { slideValue, wd } = this.state
    const slide = slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -wd]
    })
    return (
      <View style={styles.centerContainer}>
        <Animated.Image style={{
          ...style, position: 'absolute', left: 0, width: wd, transform: [{ translateX: slide }],
        }} source={source} />
        <Animated.Image style={{
          ...style, position: 'absolute', left: wd, width: wd, transform: [{ translateX: slide }],
        }} source={source} />
      </View>
    )
  }
}