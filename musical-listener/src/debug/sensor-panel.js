import React, { Component } from 'react'
import { View, Dimensions, TouchableOpacity } from 'react-native'
import SensorCircle from './sensor-circle'

const size = Math.round(Dimensions.get('window').width / 2) - 60;

export default class SensorPanel extends Component {
  arrangeCircles(readings) {
    let middle = null, n = readings.length
    if (n > 2)
      middle = --n
    const delta = 2 * Math.PI / n;
    return readings.map((val, i) => {
      if (i == middle)
        return { val, left: 0, top: 0 }
      else {
        const angle = i * delta + Math.PI / 2
        const left = Math.round(Math.cos(angle) * size)
        const top = Math.round(Math.sin(angle) * size)
        return { val, left, top }
      }
    })
  }

  render() {
    const { open, onPress, style, readings } = this.props
    return (
      <View style={style}>
        {this.arrangeCircles(readings).map((s, i) => (
          <TouchableOpacity key={i} onPress={() => onPress(i)}
            style={{
              position: 'absolute',
              top: s.top - SensorCircle.size / 2,
              left: s.left - SensorCircle.size / 2,
            }}>
            <SensorCircle reading={s.val} open={open === i} />
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

