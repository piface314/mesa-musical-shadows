import React, { Component } from 'react'
import { View, Dimensions, TouchableOpacity } from 'react-native'
import SensorCircle from "./sensor-circle"
import { styles } from '../theme'

const size = Math.round(Dimensions.get('window').width / 2) - 50;

export default class SensorPanel extends Component {
  state = {
    sensors: [] //{ char: , left: , top: , open: }
  }

  componentDidMount() {
    const { chars } = this.props
    const sensors = chars.map((char, i) => {
      if (i == 6)
        return { char, left: 0, top: 0, open: false }
      else {
        const angle = i * Math.PI / 3 + Math.PI / 2
        const left = Math.round(Math.cos(angle) * size)
        const top = Math.round(Math.sin(angle) * size)
        return { char, left, top, open: false }
      }
    })
    this.setState({ sensors });
  }

  render() {
    const { sensors } = this.state
    return (
      <View>
        {sensors.map((s, i) => (
          <TouchableOpacity key={i} onPress={() => console.warn(i)}>
            <SensorCircle characteristic={s.char} style={{
              position: 'absolute',
              top: s.top - SensorCircle.size / 2,
              left: s.left - SensorCircle.size / 2,
            }} open={s.open} />
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

