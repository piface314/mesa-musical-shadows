
import Sound from 'react-native-sound'

class Player {

  sounds = [
    "00", "01", "02", "10", "11", "12", "20", "21", "22", "30", "31", "32" 
  ].map(i => new Sound(`mms${i}.mp3`, Sound.MAIN_BUNDLE, err => console.log(i, err)))

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
