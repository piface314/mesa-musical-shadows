import React, { Component } from 'react';
import { View } from 'react-native';
import { Base64 } from 'js-base64';
import { colors } from '../theme';

export default class SensorCircle extends Component {
  static size = 42;
  state = { signal: 0.0, value: "" };
  monitor = null;

  componentDidUpdate() {
    const { characteristic } = this.props;
    if (!characteristic || this.monitor) return;
    this.monitor = characteristic.monitor((err, char) => {
      if (err) return;
      const value = Base64.decode(char.value);
      this.setState({ signal: (+value.slice(0, 4)) / 1000.0, value: value });
    });
  }

  componentWillUnmount() {
    if (this.monitor)
      this.monitor.remove();
  }

  floatToHex(float) {
    return Math.floor(255 * float).toString(16);
  }

  render() {
    const { open } = this.props;
    const { signal, value } = this.state;
    return (
      <View style={{
        width: SensorCircle.size,
        height: SensorCircle.size,
        borderRadius: SensorCircle.size / 2,
        borderWidth: 3,
        borderColor: open ? colors.rosePulse : "black",
        backgroundColor: colors.goldString + this.floatToHex(signal),
      }} />
    );
  }
}