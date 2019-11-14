
import Sound from 'react-native-sound'

class Player {

  sounds = [
  ]

  play() {
    this.sounds.forEach(s => {
      s.setNumberOfLoops(-1)
      s.play()
    })
  }

  setVolume(volume) {
    this.sounds.forEach((s, i) => s.setVolume(volume[i] || 0.0))
  }

  stop() {
    this.sounds.forEach(s => s.stop())
  }
}

const player = new Player()
export default player
