import React, { Component } from 'react'
import { Animated, Easing, Dimensions, View } from 'react-native'
import { styles } from '../theme';

export default class SlidingImage extends Component {
  state = { slideValue: new Animated.Value(0), wd: Dimensions.get('screen').width }
  resize = ({ screen }) => this.setState({ ...this.state, wd: screen.width })

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
    Dimensions.addEventListener('change', this.resize)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.resize)
  }

  render() {
    const { source, style } = this.props
    const { slideValue, wd } = this.state
    const slide = slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -wd]
    })
    return (
      <View style={[styles.centerContainer, { position: 'absolute', left: 0, top: 0, bottom: 0, right: 0 }]}>
        <Animated.Image style={{
          ...style,
          position: 'absolute',
          alignSelf: 'center',
          left: 0,
          width: wd,
          resizeMode: 'contain',
          transform: [{ translateX: slide }],
        }} source={source} />
        <Animated.Image style={{
          ...style,
          position: 'absolute',
          alignSelf: 'center',
          left: wd,
          width: wd,
          resizeMode: 'contain',
          transform: [{ translateX: slide }],
        }} source={source} />
      </View>
    )
  }
}