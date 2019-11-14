import React, { Component } from 'react'
import { SafeAreaView, Dimensions, StatusBar, View } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { styles, colors } from '../theme'
import SpinningImage from '../spinning'
import SlidingImage from './sliding'
import Player from './player'

const pulseCircle = require("../../assets/pulse-circle.png")
const wave0 = require("../../assets/wave0.png")
const wave1 = require("../../assets/wave1.png")
const size = Math.round(Dimensions.get('window').width) - 80;

export default class ListenerScreen extends Component {
  static navigationOptions = {
    title: '',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: "white"
  }

  componentDidMount() {
    const { getParam } = this.props.navigation;
    this.deviceID = getParam('deviceID', '')
    this.user = getParam('user', '')
    firestore().collection(`devices/${this.deviceID}/users`).add({ name: this.user })
      .then(res => { this.userID = res.id })
    firestore().collection(`devices/${this.deviceID}/shadows`).onSnapshot(q => {
      if (!q) return;
      const docs = q.docChanges()
      if (docs.length > 0) {
        console.log(docs[0].doc.get('values'))
        Player.setVolume(docs[0].doc.get('values'))
      }
    })
    setTimeout(() => Player.play(), 100)
  }

  componentWillUnmount() {
    if (this.userID)
      firestore().collection(`devices/${this.deviceID}/users`).doc(this.userID).delete()
        .then(() => console.log("Deleted user"))
    Player.stop()
  }

  render() {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />
        <SlidingImage source={wave0} duration={6000} />
        <SpinningImage style={{
          position: 'absolute', height: size, width: size,
          margin: 25, resizeMode: 'contain'
        }}
          source={pulseCircle} duration={4000} />
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          borderBottomColor: colors.goldString,
          borderBottomWidth: 3,
        }} />
        <SlidingImage source={wave1} duration={4000} />
      </SafeAreaView>
    )
  }
}