import React, { Component } from 'react'
import { View, Dimensions, TouchableOpacity } from 'react-native'
import SensorCircle from './sensor-circle'

const size = Math.round(Dimensions.get('window').width / 2) - 60;

export default class SensorPanel extends Component {
  arrangeCircles() {
    return this.props.chars.map((char, i) => {
      if (i == 6)
        return { char, left: 0, top: 0 }
      else {
        const angle = i * Math.PI / 3 + Math.PI / 2
        const left = Math.round(Math.cos(angle) * size)
        const top = Math.round(Math.sin(angle) * size)
        return { char, left, top }
      }
    })
  }

  render() {
    const { open, onPress, style } = this.props
    return (
      <View style={style}>
        {this.arrangeCircles().map((s, i) => (
          <TouchableOpacity key={i} onPress={() => onPress(i)}
            style={{
              position: 'absolute',
              top: s.top - SensorCircle.size / 2,
              left: s.left - SensorCircle.size / 2,
            }}>
            <SensorCircle characteristic={s.char} open={open === i} />
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

