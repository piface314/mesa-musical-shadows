import React from 'react'
import { Button } from 'react-native-elements'

const fabSize = 60
const fabMargin = 30
const FAButton = ({ color, onPress, icon }) => (
  <Button
    raised
    onPress={onPress}
    containerStyle={{
      position: 'absolute',
      bottom: fabMargin,
      right: fabMargin,
      width: fabSize,
      height: fabSize,
      borderRadius: fabSize / 2,
    }}
    buttonStyle={{
      backgroundColor: color,
      width: fabSize,
      height: fabSize,
      borderRadius: fabSize / 2,
    }}
    icon={icon}
  />
)

export default FAButton